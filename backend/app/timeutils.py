from datetime import datetime, timezone


def utcnow() -> datetime:
    """Current UTC time as a naive datetime.

    Replaces the deprecated `datetime.utcnow()`. Stored naive because SQLite
    has no timezone support; all stored/compared datetimes in this app are
    UTC by convention. When the Postgres migration lands, columns move to
    `timestamptz` and this helper drops the `.replace()`.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)
