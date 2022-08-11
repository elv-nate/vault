export default function (server) {
  // built-in default key
  server.get('/identity/oidc/key/default', () => {
    return {
      request_id: '5eeb2a46-8726-7336-76ee-8daea2860624',
      lease_id: '',
      renewable: false,
      lease_duration: 0,
      data: {
        algorithm: 'RS256',
        allowed_client_ids: ['*'],
        rotation_period: 86400,
        verification_ttl: 86400,
      },
      wrap_info: null,
      warnings: null,
      auth: null,
    };
  });

  server.get('/identity/oidc/key', () => {
    return {
      request_id: 'key-list-id',
      data: {
        keys: ['default'],
      },
    };
  });

  // ENTITY SEARCH SELECT
  server.get('/identity/entity/id', () => ({
    data: {
      key_info: { '1234-12345': { name: 'test-entity' } },
      keys: ['1234-12345'],
    },
  }));

  // GROUP SEARCH SELECT
  server.get('/identity/group/id', () => ({
    data: {
      key_info: { 'abcdef-123': { name: 'test-group' } },
      keys: ['abcdef-123'],
    },
  }));
}