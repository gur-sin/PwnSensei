package llm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type geminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func GenerateCommentary(apiKey, prompt string, evals []string) (string, error) {
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey

	fullPrompt := fmt.Sprintf("%s\nStockfish analysis:\n%s", prompt, evals)

	payload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"role": "user",
				"parts": []map[string]string{
					{"text": "You are a chess coach. Analyze the game and provide insightful commentary."},
					{"text": fullPrompt},
				},
			},
		},
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	fmt.Println("Gemini raw response:", string(body))
	defer res.Body.Close()

	var gemRes geminiResponse
	if err := json.NewDecoder(res.Body).Decode(&gemRes); err != nil {
		return "", err
	}

	if len(gemRes.Candidates) > 0 &&
		len(gemRes.Candidates[0].Content.Parts) > 0 {
		return gemRes.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("no commentary returned")
}
