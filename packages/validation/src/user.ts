import * as v from 'valibot';

export const AVATAR_CONTENT_TYPE = 'image/webp';
export const AVATAR_MAX_SIZE_BYTES = 1 * 1024 * 1024;
export const AVATAR_UPLOAD_EXPIRES_IN_SECONDS = 5 * 60;

export const avatarUploadInputSchema = v.object({
  contentType: v.pipe(
    v.string('Tipo de conteúdo deve ser uma string'),
    v.check(
      (contentType) => contentType === AVATAR_CONTENT_TYPE,
      'A foto de perfil deve ser enviada como WebP',
    ),
  ),
  contentLength: v.pipe(
    v.number('Tamanho da imagem deve ser um número'),
    v.integer('Tamanho da imagem deve ser um número inteiro'),
    v.minValue(1, 'A imagem não pode estar vazia'),
    v.maxValue(AVATAR_MAX_SIZE_BYTES, 'Imagem deve ter no máximo 1MB'),
  ),
});

export const nameSchema = v.pipe(
  v.string('Nome deve ser uma string'),
  v.nonEmpty('Nome é obrigatório'),
  v.regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
);

export const usernameSchema = v.pipe(
  v.string('Nome de usuário deve ser uma string'),
  v.minLength(3, 'Nome de usuário deve ter no mínimo 3 caracteres'),
  v.maxLength(30, 'Nome de usuário deve ter no máximo 30 caracteres'),
  v.regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores'),
);

export const passwordSchema = v.pipe(
  v.string('Senha deve ser uma string'),
  v.minLength(8, 'Senha deve ter no mínimo 8 caracteres'),
  v.regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula'),
  v.regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula'),
  v.regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  v.regex(/[@$!%*?&._]/, 'Senha deve conter pelo menos um caractere especial (@$!%*?&._)'),
);

export const confirmPasswordSchema = v.pipe(
  v.string('Confirmação de senha deve ser uma string'),
  v.nonEmpty('Confirmação de senha é obrigatória'),
);

export const emailSchema = v.pipe(v.string('Email deve ser uma string'), v.email('Email inválido'));

export const imageSchema = v.pipe(
  v.file('Imagem deve ser um arquivo'),
  v.maxSize(AVATAR_MAX_SIZE_BYTES, 'Imagem deve ter no máximo 1MB'),
  v.check((file) => file.type.startsWith('image/'), 'Arquivo deve ser uma imagem'),
  v.check(
    (file) => !['image/heic', 'image/heif'].includes(file.type),
    'Formato de imagem não suportado (HEIC/HEIF)',
  ),
);
