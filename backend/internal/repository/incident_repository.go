package repository

import (
	"errors"
	"strings"

	"github.com/nithit-cypherX/incident-report-app/backend/internal/dto"
	"github.com/nithit-cypherX/incident-report-app/backend/internal/model"
	"gorm.io/gorm"
)

type IncidentRepository interface {
	FindAll(params dto.IncidentQueryParams) ([]model.Incident, int64, error)
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

func (r *incidentRepo) FindAll(params dto.IncidentQueryParams) ([]model.Incident, int64, error) {
	var incidents []model.Incident
	var total int64

	// Base query
	query := r.db.Model(&model.Incident{})

	// Apply filters
	if params.Category != "" {
		query = query.Where("category = ?", params.Category)
	}
	if params.Status != "" {
		query = query.Where("status = ?", params.Status)
	}
	if params.Search != "" {
		searchTerm := "%" + strings.ToLower(params.Search) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?", searchTerm, searchTerm)
	}

	// Count total (before pagination)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply sorting
	sortBy := "created_at"
	if params.SortBy != "" {
		sortBy = params.SortBy
	}
	sortOrder := "desc"
	if params.SortOrder != "" {
		sortOrder = params.SortOrder
	}
	query = query.Order(sortBy + " " + sortOrder)

	// Apply pagination
	if params.Page > 0 && params.PageSize > 0 {
		offset := (params.Page - 1) * params.PageSize
		query = query.Offset(offset).Limit(params.PageSize)
	}

	// Execute query
	result := query.Find(&incidents)
	return incidents, total, result.Error
}

func (r *incidentRepo) FindByID(id string) (*model.Incident, error) {
	var incident model.Incident
	result := r.db.First(&incident, "id = ?", id)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
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
