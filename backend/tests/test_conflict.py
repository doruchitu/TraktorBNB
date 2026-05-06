from datetime import datetime
from entities import Booking, User, Machinery


def test_zile_ocupate_returnate_corect(client, db_session):
    # Cream user si utilaj mai intai
    user = User(nume="Ion", prenume="Pop", email="ion@test.com", telefon="0712345678", password_hash="hash")
    db_session.add(user)
    db_session.commit()

    utilaj = Machinery(owner_id=user.id, marca="John Deere", model="6130R", judet="Cluj", pret_zi=450.0, descriere="", imagine_url="")
    db_session.add(utilaj)
    db_session.commit()

    booking = Booking(
        utilaj_id=utilaj.id, client_id=user.id,
        data_start=datetime(2026, 6, 1),
        data_end=datetime(2026, 6, 5),
        status="approved"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get(f"/bookings/ocupate/{utilaj.id}")
    zile = response.json()["zile_ocupate"]

    assert "2026-06-01" in zile
    assert "2026-06-03" in zile
    assert "2026-06-05" in zile
    assert "2026-06-06" not in zile


def test_booking_pending_blocheaza_zilele(client, db_session):
    user = User(nume="Ion", prenume="Pop", email="ion2@test.com", telefon="0712345678", password_hash="hash")
    db_session.add(user)
    db_session.commit()

    utilaj = Machinery(owner_id=user.id, marca="Fendt", model="724", judet="Cluj", pret_zi=780.0, descriere="", imagine_url="")
    db_session.add(utilaj)
    db_session.commit()

    booking = Booking(
        utilaj_id=utilaj.id, client_id=user.id,
        data_start=datetime(2026, 7, 1),
        data_end=datetime(2026, 7, 3),
        status="pending"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get(f"/bookings/ocupate/{utilaj.id}")
    zile = response.json()["zile_ocupate"]
    assert "2026-07-01" in zile


def test_booking_rejected_nu_blocheaza_zilele(client, db_session):
    user = User(nume="Ion", prenume="Pop", email="ion3@test.com", telefon="0712345678", password_hash="hash")
    db_session.add(user)
    db_session.commit()

    utilaj = Machinery(owner_id=user.id, marca="Case", model="Optum", judet="Cluj", pret_zi=620.0, descriere="", imagine_url="")
    db_session.add(utilaj)
    db_session.commit()

    booking = Booking(
        utilaj_id=utilaj.id, client_id=user.id,
        data_start=datetime(2026, 8, 1),
        data_end=datetime(2026, 8, 3),
        status="rejected"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get(f"/bookings/ocupate/{utilaj.id}")
    zile = response.json()["zile_ocupate"]
    assert "2026-08-01" not in zile


def test_booking_cancelled_nu_blocheaza_zilele(client, db_session):
    user = User(nume="Ion", prenume="Pop", email="ion4@test.com", telefon="0712345678", password_hash="hash")
    db_session.add(user)
    db_session.commit()

    utilaj = Machinery(owner_id=user.id, marca="Claas", model="Axion", judet="Cluj", pret_zi=710.0, descriere="", imagine_url="")
    db_session.add(utilaj)
    db_session.commit()

    booking = Booking(
        utilaj_id=utilaj.id, client_id=user.id,
        data_start=datetime(2026, 9, 1),
        data_end=datetime(2026, 9, 3),
        status="cancelled"
    )
    db_session.add(booking)
    db_session.commit()

    response = client.get(f"/bookings/ocupate/{utilaj.id}")
    zile = response.json()["zile_ocupate"]
    assert "2026-09-01" not in zile