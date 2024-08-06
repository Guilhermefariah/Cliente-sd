// Função para lidar com o envio do formulário
document.getElementById('add-scene-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const imgUrl = document.getElementById('imgUrl').value;
    const description = document.getElementById('description').value;

    // Enviar os dados para a API
    axios.post('http://localhost:8080/json/scenes/new', {
        imgUrl: imgUrl,
        description: description
    })
    .then(response => {
        console.log('Cena adicionada:', response.data);
        // Limpar o formulário após o envio
        document.getElementById('add-scene-form').reset();
        // Recarregar as cenas
        loadScenes();
    })
    .catch(error => {
        console.error('Erro ao adicionar cena:', error);
        alert('Erro ao adicionar cena. Tente novamente mais tarde.');
    });
});

// Função para carregar as cenas
function loadScenes() {
    axios.get('http://localhost:8080/json/scenes')
        .then(response => {
            console.log('Dados recebidos:', response.data);

            const scenes = response.data;
            const container = document.getElementById('scenes-container');
            container.innerHTML = ''; // Limpar o conteúdo anterior

            scenes.forEach(scene => {
                const sceneElement = document.createElement('div');
                sceneElement.classList.add('col-md-4', 'scene-card'); // Adicionar classes do Bootstrap
                sceneElement.innerHTML = `  
                <div class="card mb-4">
                    <img src="${scene.sceneImage}" class="card-img-top" alt="Scene Image">
                    <div class="card-body">
                        <h5 class="card-title">${scene.name}</h5>
                        <p class="card-text"><strong>Episode:</strong> ${scene.episode}</p>
                        <p class="card-text"><strong>Likes:</strong> ${scene.likes}</p>
                        <p class="card-text"><strong>Start Time:</strong> ${scene.startTime}</p>
                        <p class="card-text"><strong>Description:</strong> ${scene.description}</p>
                        <p class="card-text"><strong>Image URL:</strong> <a href="${scene.sceneImage}" target="_blank">${scene.sceneImage}</a></p>
                        <button class="btn btn-primary" onclick="likeScene(${scene.id})">Like</button>
                        <button class="btn btn-secondary" onclick="editDescription(${scene.id})">Edit Description</button>
                        <button class="btn btn-danger" onclick="deleteScene(${scene.id})">Delete</button>
                    </div>
                </div>

            
                `;
                container.appendChild(sceneElement);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar cenas:', error);
            const container = document.getElementById('scenes-container');
            container.innerHTML = '<div class="alert alert-danger" role="alert">Erro ao carregar cenas. Tente novamente mais tarde.</div>';
        });
}

// Função para deletar uma cena
function deleteScene(id) {
    axios.delete(`http://localhost:8080/json/scenes/remove/${id}`)
        .then(response => {
            console.log('Cena removida:', response.data);
            // Recarregar as cenas após a exclusão
            loadScenes();
        })
        .catch(error => {
            console.error('Erro ao remover cena:', error);
            alert('Erro ao remover cena. Tente novamente mais tarde.');
        });
}

function likeScene(id) {
    axios.put(`http://localhost:8080/json/scenes/like/${id}`)
        .then(response => {
            console.log('Cena curtida:', response.data);
            loadScenes();
        })
        .catch(error => {
            console.error('Erro ao curtir cena:', error);
            alert('Erro ao curtir cena. Tente novamente mais tarde.');
        })
}

let currentSceneId;

function editDescription(id) {
    currentSceneId = id; // Salva o ID da cena atual para usar na função submitDescription
    // Abre o modal
    new bootstrap.Modal(document.getElementById('editDescriptionModal')).show();
}

function submitDescription() {
    const newDescription = document.getElementById('newDescription').value;
    if (newDescription.trim() === '') {
        alert('Descrição não pode ser vazia.');
        return;
    }
    editDescriptionOnServer(currentSceneId, newDescription);
}

function editDescriptionOnServer(id, newDescription) {
    axios.put(`http://localhost:8080/json/scenes/description/${id}`, 
        { description: newDescription })
        .then(response => {
            console.log('Descrição atualizada:', response.data);
            loadScenes();
            // Fecha o modal
            $('#editDescriptionModal').modal('hide'); // Usando jQuery para fechar o modal
        })
        .catch(error => {
            console.error('Erro ao atualizar descrição:', error);
            alert('Erro ao atualizar descrição. Tente novamente mais tarde.');
        });
}

// Carregar as cenas quando a página for carregada
loadScenes();
