package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

// Estrutura deve ser igual  ao JSON enviado pelo Python
type WeatherData struct {
	City          string  `json:"city"`
	Temperature   float64 `json:"temperature"`
	Humidity      float64 `json:"humidity"`
	WindSpeed     float64 `json:"wind_speed"`
	ConditionCode int     `json:"condition_code"`
	Timestamp     string  `json:"timestamp"`
}

func main() {
	rabbitURL := os.Getenv("RABBIT_URL")
	apiURL := os.Getenv("API_URL")
	queueName := "weather_queue"

	if rabbitURL == "" {
		rabbitURL = "amqp://user:password@localhost:5672/"
	}

	var conn *amqp.Connection
	var err error

	for {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			log.Println("✅ Worker conectado ao RabbitMQ!")
			break
		}
		log.Printf("Falha ao conectar no RabbitMQ (%s). Tentando em 5s...", err)
		time.Sleep(5 * time.Second)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar consumidor")

	log.Println("Worker Go iniciado. Aguardando mensagens...")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Printf("Recebido: %s", d.Body)

			var data WeatherData
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("Erro ao decodificar JSON: %s", err)
				d.Ack(false)
				continue
			}

			err = sendToAPI(apiURL, data)
			if err != nil {
				log.Printf("Erro ao enviar para API: %s", err)
				d.Ack(false)
			} else {
				log.Println("Dados enviados para API com sucesso!")
				d.Ack(false)
			}
		}
	}()

	<-forever
}

func sendToAPI(url string, data WeatherData) error {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}
	if url == "" {
		log.Println("API_URL não definida. Simulando envio...")
		return nil
	}

	resp, err := http.Post(url+"/weather", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return log.Output(1, "API retornou erro: "+resp.Status)
	}

	return nil
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
