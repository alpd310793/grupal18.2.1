// Espera a que el documento esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    const url = "https://6542330df0b8287df1ffac9a.mockapi.io/users/";

    // Obtener elementos del DOM
    const inputGet1Id = document.getElementById("inputGet1Id");
    const btnGet1 = document.getElementById("btnGet1");
    const inputPostNombre = document.getElementById("inputPostNombre");
    const inputPostApellido = document.getElementById("inputPostApellido");
    const btnPost = document.getElementById("btnPost");
    const inputPutId = document.getElementById("inputPutId");
    const btnPut = document.getElementById("btnPut");
    const inputDelete = document.getElementById("inputDelete");
    const btnDelete = document.getElementById("btnDelete");
    const alertError = document.getElementById("alert-error");
    const dataModal = new bootstrap.Modal(document.getElementById("dataModal"));
    const inputPutNombre = document.getElementById("inputPutNombre");
    const inputPutApellido = document.getElementById("inputPutApellido");
    const btnSendChanges = document.getElementById("btnSendChanges");

    // Función para mostrar un mensaje de error
    function showError(message) {
        alertError.textContent = message;
        alertError.classList.remove("fade");
    }

    // Función para ocultar el mensaje de error
    function hideError() {
        alertError.classList.add("fade");
    }

    // Función para listar usuarios
    function listarUsuarios() {
        hideError();
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud.");
                }
                return response.json();
            })
            .then((data) => {
                const results = document.getElementById("results");
                results.innerHTML = "";
                data.forEach((user) => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("list-group-item");
                    listItem.textContent = `ID: ${user.id}, Nombre: ${user.name}, Apellido: ${user.lastname}`;
                    results.appendChild(listItem);
                });
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Función para buscar un usuario por ID
    function buscarUsuario() {
        hideError();
        const userId = inputGet1Id.value.trim();
        if (!userId) {
            showError("Por favor, ingrese un ID para buscar.");
            return;
        }

        fetch(`${url}${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Usuario no encontrado.");
                }
                return response.json();
            })
            .then((data) => {
                const results = document.getElementById("results");
                results.innerHTML = "";
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item");
                listItem.textContent = `ID: ${data.id}, Nombre: ${data.name}, Apellido: ${data.lastname}`;
                results.appendChild(listItem);
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Función para agregar un usuario
    function agregarUsuario() {
        hideError();
        const nombre = inputPostNombre.value.trim();
        const apellido = inputPostApellido.value.trim();
        if (!nombre || !apellido) {
            showError("Por favor, complete todos los campos.");
            return;
        }

        const data = { name: nombre, lastname: apellido };
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al agregar el usuario.");
                }
                return response.json();
            })
            .then(() => {
                listarUsuarios();
                inputPostNombre.value = "";
                inputPostApellido.value = "";
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Función para abrir el modal de modificación
    function modificarUsuario() {
        hideError();
        const userId = inputPutId.value.trim();
        if (!userId) {
            showError("Por favor, ingrese un ID para modificar.");
            return;
        }

        fetch(`${url}${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Usuario no encontrado.");
                }
                return response.json();
            })
            .then((data) => {
                inputPutNombre.value = data.name;
                inputPutApellido.value = data.lastname;
                btnSendChanges.disabled = false;
                dataModal.show();
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Función para guardar los cambios en la modificación
    function guardarCambios() {
        hideError();
        const userId = inputPutId.value.trim();
        const nombre = inputPutNombre.value.trim();
        const apellido = inputPutApellido.value.trim();
        if (!userId || !nombre || !apellido) {
            showError("Por favor, complete todos los campos.");
            return;
        }

        const data = { name: nombre, lastname: apellido };
        fetch(`${url}${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al modificar el usuario.");
                }
                dataModal.hide();
                listarUsuarios();
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Función para eliminar un usuario
    function borrarUsuario() {
        hideError();
        const userId = inputDelete.value.trim();
        if (!userId) {
            showError("Por favor, ingrese un ID para eliminar.");
            return;
        }

        fetch(`${url}${userId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al eliminar el usuario.");
                }
                listarUsuarios();
            })
            .catch((error) => {
                showError(error.message);
            });
    }

    // Agregar eventos a los botones
    btnGet1.addEventListener("click", buscarUsuario);
    btnPost.addEventListener("click", agregarUsuario);
    btnPut.addEventListener("click", modificarUsuario);
    btnSendChanges.addEventListener("click", guardarCambios);
    btnDelete.addEventListener("click", borrarUsuario);

    // Cargar la lista de usuarios al cargar la página
    listarUsuarios();
});
