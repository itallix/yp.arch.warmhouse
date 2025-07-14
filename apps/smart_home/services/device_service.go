package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"smarthome/models"
	"time"
)

// DeviceService handles fetching temperature data from external API
type DeviceService struct {
	BaseURL    string
	HTTPClient *http.Client
}

// NewDeviceService creates a new temperature service
func NewDeviceService(baseURL string) *DeviceService {
	return &DeviceService{
		BaseURL: fmt.Sprintf("%s/sensors", baseURL),
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// CreateDevice creates a new device based on payload
func (s *DeviceService) CreateDevice(sensor *models.SensorCreate) (*models.Sensor, error) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(sensor); err != nil {
		return nil, fmt.Errorf("error encoding sensor: %w", err)
	}
	resp, err := s.HTTPClient.Post(s.BaseURL, "application/json", &buf)
	if err != nil {
		return nil, fmt.Errorf("error creating sensor: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var deviceResp models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&deviceResp); err != nil {
		return nil, fmt.Errorf("error decoding device response: %w", err)
	}

	return &deviceResp, nil
}

func (s *DeviceService) GetDeviceByID(sensorID int) (*models.Sensor, error) {
	resp, err := s.HTTPClient.Get(fmt.Sprintf("%s/%d", s.BaseURL, sensorID))
	if err != nil {
		return nil, fmt.Errorf("error retrieving sensor data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	var deviceResp models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&deviceResp); err != nil {
		return nil, fmt.Errorf("error decoding device response: %w", err)
	}

	return &deviceResp, nil
}
