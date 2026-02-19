package service

import (
    "errors"

    "github.com/google/uuid"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/dto"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/model"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/repository"
)

type IncidentService interface {
    GetAll() ([]model.Incident, error)
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

func (s *incidentService) GetAll() ([]model.Incident, error) {
    return s.repo.FindAll()
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
    // First check the incident exists
    incident, err := s.repo.FindByID(id)
    if err != nil {
        return nil, err
    }
    if incident == nil {
        return nil, errors.New("incident not found")
    }

    // Apply updates
    incident.Title       = input.Title
    incident.Description = input.Description
    incident.Category    = model.Category(input.Category)
    incident.Status      = model.Status(input.Status)

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