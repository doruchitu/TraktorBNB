from entities import User


def test_atomicitate_user_invalid(client, db_session):
    initial_count = db_session.query(User).count()
    
    response = client.post("/users/", json={
        "nume": "", "prenume": "",
        "email": "not-an-email",
        "telefon": "", "password": ""
    })
    
    final_count = db_session.query(User).count()
    assert final_count == initial_count


def test_consistenta_email_unic(client, db_session):
    client.post("/users/", json={
        "nume": "Ion", "prenume": "Pop",
        "email": "unic@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    count = db_session.query(User).filter(
        User.email == "unic@test.com"
    ).count()
    assert count == 1


def test_izolare_tranzactii(client, db_session):
    client.post("/users/", json={
        "nume": "Ion", "prenume": "Pop",
        "email": "existent@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    client.post("/users/", json={
        "nume": "Alt", "prenume": "User",
        "email": "existent@test.com",
        "telefon": "0799999999", "password": "parola456"
    })
    
    user = db_session.query(User).filter(
        User.email == "existent@test.com"
    ).first()
    assert user.nume == "Ion"


def test_durabilitate_date_salvate(client, db_session):
    client.post("/users/", json={
        "nume": "Persistent", "prenume": "User",
        "email": "persistent@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    db_session.expire_all()
    
    user = db_session.query(User).filter(
        User.email == "persistent@test.com"
    ).first()
    assert user is not None
    assert user.nume == "Persistent"