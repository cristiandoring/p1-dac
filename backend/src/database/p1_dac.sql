DROP DATABASE IF EXISTS p1_dac;


CREATE DATABASE IF NOT EXISTS p1_dac
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE p1_dac;

select * from usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
senha_hash VARCHAR(255) NOT NULL,
perfil ENUM('admin', 'comum') NOT NULL DEFAULT 'comum',
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES
('Administrador', 'admin@ifrs.edu.br', '$2b$10$d71oAG51XxoT5mZ4sN4ByOV/G.lvGjmwHLm5xRPl89HMxqVRyBTKy', 'admin'),
('Usuário Comum', 'usuario@ifrs.edu.br', '$2b$10$d71oAG51XxoT5mZ4sN4ByOV/G.lvGjmwHLm5xRPl89HMxqVRyBTKy', 'comum');

CREATE TABLE IF NOT EXISTS eventos (
id INT AUTO_INCREMENT PRIMARY KEY,
titulo VARCHAR(150) NOT NULL,
descricao TEXT,
localizacao VARCHAR(150) NOT NULL,
data_evento DATETIME NOT NULL,
max_voluntarios INT NOT NULL,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voluntarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
telefone VARCHAR(20),
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscricoes (
evento_id INT NOT NULL,
voluntario_id INT NOT NULL,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (evento_id, voluntario_id),
FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
FOREIGN KEY (voluntario_id) REFERENCES voluntarios(id) ON DELETE CASCADE
);

INSERT INTO eventos (titulo, descricao, localizacao, data_evento, max_voluntarios) VALUES
('Campanha de Doação de Sangue', 'Doação em parceria com o hemocentro local.', 'Ginásio do Campus', '2026-11-10 09:00:00', 3),
('Arrecadação de Alimentos', 'Coleta de alimentos não perecíveis.', 'Pátio Central', '2026-11-20 14:00:00', 5),
('Mutirão Ambiental', 'Limpeza e plantio de mudas no entorno do campus.', 'Entrada Principal', '2026-12-05 08:00:00', 10);

INSERT INTO voluntarios (nome, email, telefone) VALUES
('Ana Souza', 'ana@example.com', '54999990001'),
('Bruno Lima', 'bruno@example.com', '54999990002'),
('Carla Dias', 'carla@example.com', '54999990003'),
('Diego Rocha', 'diego@example.com', '54999990004'),
('Elisa Martins', 'elisa@example.com', '54999990005');

INSERT INTO inscricoes (evento_id, voluntario_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 1);