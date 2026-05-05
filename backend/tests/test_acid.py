
def test_atomicitate_user_invalid(db_session):
    # Daca userul e invalid, nimic nu se salveaza
    initial_count = db_session.query(User).count()
    
    response = client.post("/users/", json={
        "nume": "", "prenume": "",
        "email": "not-an-email",
        "telefon": "", "password": ""
    })
    
    final_count = db_session.query(User).count()
    assert final_count == initial_count  # nimic nu s-a adaugat

def test_consistenta_email_unic(db_session):
    # Baza de date nu permite doua emailuri identice
    client.post("/users/", json={
        "nume": "Ion", "prenume": "Pop",
        "email": "unic@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    count = db_session.query(User).filter(
        User.email == "unic@test.com"
    ).count()
    assert count == 1  # exact un user cu acest email

def test_izolare_tranzactii(db_session):
    # O tranzactie esuata nu afecteaza datele existente
    client.post("/users/", json={
        "nume": "Ion", "prenume": "Pop",
        "email": "existent@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    # Incercam sa adaugam un duplicat
    client.post("/users/", json={
        "nume": "Alt", "prenume": "User",
        "email": "existent@test.com",
        "telefon": "0799999999", "password": "parola456"
    })
    
    # Userul original trebuie sa fie intact
    user = db_session.query(User).filter(
        User.email == "existent@test.com"
    ).first()
    assert user.nume == "Ion"  # datele originale neschimbate

def test_durabilitate_date_salvate(db_session):
    # Datele salvate persista dupa commit
    client.post("/users/", json={
        "nume": "Persistent", "prenume": "User",
        "email": "persistent@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    
    db_session.expire_all()  # golim cache-ul sesiunii
    
    user = db_session.query(User).filter(
        User.email == "persistent@test.com"
    ).first()
    assert user is not None
    assert user.nume == "Persistent"