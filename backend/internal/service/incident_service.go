package service

import (
	"errors"
	"math"

	"github.com/google/uuid"
	"github.com/nithit-cypherX/incident-report-app/backend/internal/dto"
	"github.com/nithit-cypherX/incident-report-app/backend/internal/model"
	"github.com/nithit-cypherX/incident-report-app/backend/internal/repository"
)

type IncidentService interface {
	GetAll(params dto.IncidentQueryParams) (*dto.PaginatedResponse, error)
	GetByID(id string) (*model.Incident, error)
	Create(input dto.CreateIncidentDTO) (*model.Incident, error)
	Update(id string, input dto.UpdateIncidentDTO) (*model.Incident, error)
	Delete(id string) error
}

type incidentService struct {
	repo repository.IncidentRepository
}

func NewIncidentService(repo repository.IncidentRepository) IncidentService {
	return &incidentService{repo}
}

func (s *incidentService) GetAll(params dto.IncidentQueryParams) (*dto.PaginatedResponse, error) {
	// Set defaults
	if params.Page == 0 {
		params.Page = 1
	}
	if params.PageSize == 0 {
		params.PageSize = 10
	}

	incidents, total, err := s.repo.FindAll(params)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(params.PageSize)))

	return &dto.PaginatedResponse{
		Data:       incidents,
		Total:      total,
		Page:       params.Page,
		PageSize:   params.PageSize,
		TotalPages: totalPages,
	}, nil
}

func (s *incidentService) GetByID(id string) (*model.Incident, error) {
	incident, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if incident == nil {
		return nil, errors.New("incident not found")
	}
	return incident, nil
}

func (s *incidentService) Create(input dto.CreateIncidentDTO) (*model.Incident, error) {
	incident := &model.Incident{
		ID:          uuid.New().String(),
		Title:       input.Title,
		Description: input.Description,
		Category:    model.Category(input.Category),
		Status:      model.Status(input.Status),
	}
	err := s.repo.Create(incident)
	return incident, err
}

func (s *incidentService) Update(id string, input dto.UpdateIncidentDTO) (*model.Incident, error) {
	incident, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if incident == nil {
		return nil, errors.New("incident not found")
	}

	incident.Title = input.Title
	incident.Description = input.Description
	incident.Category = model.Category(input.Category)
	incident.Status = model.Status(input.Status)

	err = s.repo.Update(incident)
	return incident, err
}

func (s *incidentService) Delete(id string) error {
	incident, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if incident == nil {
		return errors.New("incident not found")
	}
	return s.repo.Delete(id)
}
