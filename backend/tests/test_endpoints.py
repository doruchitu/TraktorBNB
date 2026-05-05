
# USERS
def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "online"}

def test_create_user_success():
    response = client.post("/users/", json={
        "nume": "Ion", "prenume": "Popescu",
        "email": "ion@test.com",
        "telefon": "0712345678",
        "password": "parola123"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "ion@test.com"
    assert "password" not in response.json()  # parola nu se returneaza

def test_create_user_email_duplicat():
    client.post("/users/", json={
        "nume": "Ion", "prenume": "Popescu",
        "email": "duplicat@test.com",
        "telefon": "0712345678", "password": "parola123"
    })
    response = client.post("/users/", json={
        "nume": "Maria", "prenume": "Ionescu",
        "email": "duplicat@test.com",
        "telefon": "0787654321", "password": "altaparola"
    })
    assert response.status_code == 400
    assert "Email deja folosit" in response.json()["detail"]

def test_create_user_campuri_lipsa():
    response = client.post("/users/", json={
        "nume": "Ion", "email": "ion@test.com"
        # lipsesc prenume, telefon, password
    })
    assert response.status_code == 422

# MACHINERY
def test_get_machinery_lista_goala():
    response = client.get("/machinery/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_machinery_inexistent():
    response = client.get("/machinery/99999")
    assert response.status_code == 404

def test_adauga_machinery_fara_auth():
    response = client.post("/machinery/", json={
        "marca": "John Deere", "model": "6130R",
        "judet": "Cluj", "pret_zi": 450.0,
        "descriere": "", "imagine_url": ""
    })
    assert response.status_code == 401

# BOOKINGS
def test_rezervare_fara_auth():
    response = client.post("/bookings/", json={
        "utilaj_id": 1,
        "data_start": "2026-06-01T00:00:00",
        "data_end": "2026-06-05T00:00:00",
    })
    assert response.status_code == 401

def test_zile_ocupate_utilaj_inexistent():
    response = client.get("/bookings/ocupate/99999")
    assert response.status_code == 200
    assert response.json()["zile_ocupate"] == []

# CONTRACT
def test_contract_fara_auth():
    response = client.get("/contract/1")
    assert response.status_code == 401

def test_contract_rezervare_inexistenta(auth_headers):
    response = client.get("/contract/99999", headers=auth_headers)
    assert response.status_code == 404