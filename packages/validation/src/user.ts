import * as v from 'valibot';

export const nameSchema = v.pipe(
  v.string('Nome deve ser uma string'),
  v.nonEmpty('Nome é obrigatório'),
  v.regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
);

export const username = v.pipe(
  v.string('Nome de usuário deve ser uma string'),
  v.nonEmpty('Nome de usuário é obrigatório'),
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

export const emailSchema = v.pipe(v.string('Email deve ser uma string'), v.email('Email inválido'));

export const imageSchema = v.pipe(
  v.file('Imagem deve ser um arquivo'),
  v.maxSize(1 * 1024 * 1024, 'Imagem deve ter no máximo 1MB'),
  v.check((file) => file.type.startsWith('image/'), 'Arquivo deve ser uma imagem'),
  v.check(
    (file) => !['image/heic', 'image/heif'].includes(file.type),
    'Formato de imagem não suportado (HEIC/HEIF)',
  ),
);
