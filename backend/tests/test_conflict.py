
def test_zile_ocupate_returnate_corect(db_session):
    # Cream un booking aprobat
    booking = Booking(
        utilaj_id=1, client_id=2,
        data_start=datetime(2026, 6, 1),
        data_end=datetime(2026, 6, 5),
        status="approved"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get("/bookings/ocupate/1")
    zile = response.json()["zile_ocupate"]

    assert "2026-06-01" in zile
    assert "2026-06-03" in zile  # zi din mijloc
    assert "2026-06-05" in zile
    assert "2026-06-06" not in zile  # ziua de după

def test_booking_pending_blocheaza_zilele(db_session):
    # Booking pending tot trebuie să blocheze zilele
    booking = Booking(
        utilaj_id=1, client_id=2,
        data_start=datetime(2026, 7, 1),
        data_end=datetime(2026, 7, 3),
        status="pending"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get("/bookings/ocupate/1")
    zile = response.json()["zile_ocupate"]
    assert "2026-07-01" in zile

def test_booking_rejected_nu_blocheaza_zilele(db_session):
    # Booking respins NU trebuie să blocheze zilele
    booking = Booking(
        utilaj_id=1, client_id=2,
        data_start=datetime(2026, 8, 1),
        data_end=datetime(2026, 8, 3),
        status="rejected"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get("/bookings/ocupate/1")
    zile = response.json()["zile_ocupate"]
    assert "2026-08-01" not in zile

def test_booking_cancelled_nu_blocheaza_zilele(db_session):
    booking = Booking(
        utilaj_id=1, client_id=2,
        data_start=datetime(2026, 9, 1),
        data_end=datetime(2026, 9, 3),
        status="cancelled"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get("/bookings/ocupate/1")
    zile = response.json()["zile_ocupate"]
    assert "2026-09-01" not in zile