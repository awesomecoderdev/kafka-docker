const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");

// new app
const app = express();

// use middleware
app.use(express.json());
app.use(cors());

// Initialize Kafka client
const kafka = new Kafka({
	clientId: "awesomecoder",
	brokers: ["kafka:9092"], // Update with your Kafka broker's address
});

// Create a producer instance
const producer = kafka.producer();

// Create a consumer instance
const consumer = kafka.consumer({ groupId: "test-group" });

// Define the topic
const topic = "test-topic";

// Middleware to produce a message
app.get("/produce", async (req, res) => {
	try {
		const { key, value, partition } = req.body; // Assuming message options are passed in the request body

		// Validate required fields
		if (!value) {
			return res.status(400).send("Message value is required");
		}

		// Construct message object
		const message = {
			value: JSON.stringify(value), // Assuming value is an object and needs to be stringified
		};

		// Add optional message options
		if (key) {
			message.key = key;
		}

		if (partition) {
			message.partition = partition;
		}

		// Produce message
		await producer.connect();
		await producer.send({
			topic,
			messages: [message],
		});
		await producer.disconnect();

		res.send("Message produced successfully");
	} catch (error) {
		console.error("Error producing message:", error);
		res.status(500).send("Error producing message");
	}
});

// Middleware to consume messages
app.get("/consume", async (req, res) => {
	try {
		await consumer.connect();
		await consumer.subscribe({ topic });
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				console.log({
					value: message.value.toString(),
				});
			},
		});
		res.send("Consuming messages");
	} catch (error) {
		console.error("Error consuming messages:", error);
		res.status(500).send("Error consuming messages");
	}
});

// Start the Express server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
