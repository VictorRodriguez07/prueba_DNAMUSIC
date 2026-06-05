import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository';
import { AppError } from '../middlewares/errorHandler';
import { RegisterDto, LoginDto } from '../validations/auth.schema';
import { JwtPayload } from '../types';

//se aplica el hash 12 veces. esto nos garantiza seguridad y rendimiento al escoger el número de 12 veces.
const SALT_ROUNDS = 12;

//tiempo minimo de respuesta en milisegundos. Esto evita que algún atacante
//puede inferir emails midiendo tiempos de respuesta.
const MIN_RESPONSE_MS = 300;

//función que firma, genera el JWT con el payload y tiempo de expiración.
function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as jwt.SignOptions['expiresIn'],
    });
}

//funcion encargada de manejar la logica de registro de usuarios y login.
export const authService = {
    register: async (dto: RegisterDto) => {

        //busca si ya existe un usuario con el mismo email.
        const exists = await authRepository.findByEmail(dto.email);
        if (exists) throw new AppError(409, 'El email ya está registrado.');

        //realiza el hash de la contraseña.
        const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
        //crea el usuario en la base de datos.
        const user = await authRepository.create({
            nombre: dto.nombre,
            email: dto.email,
            password: hashed,
            role: dto.role,
            sedeId: dto.sedeId ?? null,
        });

        //se eliminan la contraseña del objeto y el resto de datos se pasan a safeUser, la cual es retornada.
        const { password: _pw, ...safeUser } = user;
        return safeUser;
    },

    //funcion encargada de manejar la logica del login de usuarios.
    login: async (dto: LoginDto) => {

        //Se mide el tiempo actual para al final calcular el tiempo que tomó el login
        //que minimo debe ser 3ms
        const start = Date.now();

        const user = await authRepository.findByEmail(dto.email);

        //Se crea un hash falso para que siempre se compare la contraseña y se llegue al tiempo de respuesta establecido
        const dummyHash = '$2b$12$invalidhashusedtofilltime.invalidhashusedtofilltime.';

        //Si existe el user, se guarda la contraseña de bd. Si no, el hash falso.
        const passwordToCompare = user?.password ?? dummyHash;

        //comparación de la contraseña.
        const isValid = await bcrypt.compare(dto.password, passwordToCompare);

        //cálculo del tiempo que tomó el login y de ser necesario, forzar a esperar hasta que llegue al tiempo
        //establecido
        const elapsed = Date.now() - start;
        if (elapsed < MIN_RESPONSE_MS) {
            await new Promise((r) => setTimeout(r, MIN_RESPONSE_MS - elapsed));
        }

        //Si no existe el usuario o la contraseña es incorrecta, se lanza error.
        if (!user || !isValid) {
            throw new AppError(401, 'Credenciales inválidas.');
        }

        //recuperación del user logueado y se guarda en el payload.
        const payload: JwtPayload = {
            userId: user.id,
            role: user.role,
            sedeId: user.sedeId,
        };

        //Llamado a la función encargada de crear el token y firma digital. Se envía payload como parámetro.
        const token = signToken(payload);
        const { password: _pw, ...safeUser } = user;

        return { token, user: safeUser };
    },
};  