from fastapi import Depends, HTTPException, status

from .models import User
from .security import get_current_user


def require_role(*roles: str):
    """Dependency factory: 403s unless the current user has one of `roles`."""

    def _check(current: User = Depends(get_current_user)) -> User:
        if current.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Requires role: {' or '.join(roles)}")
        return current

    return _check
