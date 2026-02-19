package repository

import (
    "errors"

    "github.com/nithit-cypherX/incident-report-app/backend/internal/model"
    "gorm.io/gorm"
)

type IncidentRepository interface {
    FindAll() ([]model.Incident, error)
    FindByID(id string) (*model.Incident, error)
    Create(incident *model.Incident) error
    Update(incident *model.Incident) error
    Delete(id string) error
}

type incidentRepo struct {
    db *gorm.DB
}

func NewIncidentRepository(db *gorm.DB) IncidentRepository {
    return &incidentRepo{db}
}

func (r *incidentRepo) FindAll() ([]model.Incident, error) {
    var incidents []model.Incident
    result := r.db.Order("created_at desc").Find(&incidents)
    return incidents, result.Error
}

func (r *incidentRepo) FindByID(id string) (*model.Incident, error) {
    var incident model.Incident
    result := r.db.First(&incident, "id = ?", id)
    if errors.Is(result.Error, gorm.ErrRecordNotFound) {
        return nil, nil // not found, return nil cleanly
    }
    return &incident, result.Error
}

func (r *incidentRepo) Create(incident *model.Incident) error {
    return r.db.Create(incident).Error
}

func (r *incidentRepo) Update(incident *model.Incident) error {
    return r.db.Save(incident).Error
}

func (r *incidentRepo) Delete(id string) error {
    return r.db.Delete(&model.Incident{}, "id = ?", id).Error
}