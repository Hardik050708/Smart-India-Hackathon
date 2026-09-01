from .auth_routes import router as auth_router
from .challenge_routes import router as challenge_router
from .project_routes import router as project_router
from .proposal_routes import router as proposal_router
from .credit_routes import router as credit_router
from .analytics_routes import router as analytics_router

__all__ = [
    "auth_router",
    "challenge_router",
    "project_router",
    "proposal_router",
    "credit_router",
    "analytics_router",
]
