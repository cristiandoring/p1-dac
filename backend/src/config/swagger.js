const path = require('node:path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API de Voluntariado do IFRS',
      version: '1.0.0',
      description:
        'API para gerenciar voluntários e eventos sociais, com autenticação JWT e perfis de acesso.',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    tags: [
      { name: 'Autenticação', description: 'Login e geração do token JWT' },
      { name: 'Eventos', description: 'Gerenciamento de eventos sociais' },
      { name: 'Dashboard', description: 'Painel para usuários autenticados' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Evento: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Campanha de Doação de Sangue' },
            descricao: { type: 'string', nullable: true, example: 'Parceria com o hemocentro.' },
            localizacao: { type: 'string', example: 'Ginásio do Campus' },
            data_evento: {
              type: 'string',
              format: 'date-time',
              example: '2026-11-10T12:00:00.000Z',
            },
            max_voluntarios: { type: 'integer', example: 3 },
            criado_em: { type: 'string', format: 'date-time' },
          },
        },
        EventoEntrada: {
          type: 'object',
          required: ['titulo', 'localizacao', 'data_evento', 'max_voluntarios'],
          properties: {
            titulo: { type: 'string', example: 'Feira de Adoção de Animais' },
            descricao: { type: 'string', example: 'Parceria com a ONG local.' },
            localizacao: { type: 'string', example: 'Pátio Central' },
            data_evento: { type: 'string', example: '2026-12-15 10:00:00' },
            max_voluntarios: { type: 'integer', minimum: 1, example: 8 },
          },
        },
        LoginEntrada: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', example: 'admin@ifrs.edu.br' },
            senha: { type: 'string', example: '123456' },
          },
        },
        Token: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
            user: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'admin@ifrs.edu.br' },
                role: { type: 'string', example: 'admin' },
              },
            },
          },
        },
        Erro: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem descrevendo o problema.' },
            status: { type: 'integer', example: 400 },
          },
        },
      },
      responses: {
        Invalido: {
          description: 'Dados inválidos',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
        },
        NaoAutenticado: {
          description: 'Token ausente, inválido ou expirado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
        },
        SemPermissao: {
          description: 'Usuário autenticado, mas sem permissão (exige perfil admin)',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
        },
        NaoEncontrado: {
          description: 'Recurso não encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
