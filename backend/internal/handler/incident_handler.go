package handler

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/dto"
    "github.com/nithit-cypherX/incident-report-app/backend/internal/service"
)

type IncidentHandler struct {
    service service.IncidentService
}

func NewIncidentHandler(service service.IncidentService) *IncidentHandler {
    return &IncidentHandler{service}
}

func (h *IncidentHandler) GetAll(c *gin.Context) {
    incidents, err := h.service.GetAll()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch incidents"})
        return
    }
    c.JSON(http.StatusOK, incidents)
}

func (h *IncidentHandler) GetByID(c *gin.Context) {
    id := c.Param("id")
    incident, err := h.service.GetByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, incident)
}

func (h *IncidentHandler) Create(c *gin.Context) {
    var input dto.CreateIncidentDTO
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    incident, err := h.service.Create(input)
    if err != nil {
        c.JSON(http.StatusUnprocessableEntity, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, incident)
}

func (h *IncidentHandler) Update(c *gin.Context) {
    id := c.Param("id")

    var input dto.UpdateIncidentDTO
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    incident, err := h.service.Update(id, input)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, incident)
}

func (h *IncidentHandler) Delete(c *gin.Context) {
    id := c.Param("id")
    if err := h.service.Delete(id); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusNoContent, nil)
}