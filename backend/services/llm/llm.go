package llm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

// Response struct for parsing Groq response
type groqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func GenerateCommentary(apiKey, prompt string, evals []string) (string, error) {
	url := "https://api.groq.com/openai/v1/chat/completions"

	// Build the full prompt
	fullPrompt := fmt.Sprintf("%s\nStockfish analysis:\n%s", prompt, evals)

	payload := map[string]interface{}{
		"model": "llama3-8b-8192", // example, you can change
		"messages": []map[string]string{
			{"role": "system", "content": "You are a chess coach."},
			{"role": "user", "content": fullPrompt},
		},
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	var groqRes groqResponse
	if err := json.NewDecoder(res.Body).Decode(&groqRes); err != nil {
		return "", err
	}

	if len(groqRes.Choices) > 0 {
		return groqRes.Choices[0].Message.Content, nil
	}
	return "", fmt.Errorf("no commentary returned")
}
