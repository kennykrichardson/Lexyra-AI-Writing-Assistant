"""Validated request and response models."""

from enum import Enum

from pydantic import BaseModel, Field, field_validator

from app.config import settings


class WritingStyle(str, Enum):
    professional = "professional"
    articulate = "articulate"
    concise = "concise"
    confident = "confident"
    recruiter_friendly = "recruiter-friendly"
    academic = "academic"


class EnhanceRequest(BaseModel):
    text: str = Field(min_length=1, max_length=settings.max_input_chars)
    style: WritingStyle = WritingStyle.professional

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Text cannot be blank.")
        return value.strip()


class EnhanceResponse(BaseModel):
    original_text: str
    enhanced_text: str
    style: WritingStyle
