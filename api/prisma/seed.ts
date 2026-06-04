import { PrismaClient, Role, EstadoSede, EstadoEstudiante } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed...');

    await prisma.estudiante.deleteMany();
    await prisma.user.deleteMany();
    await prisma.sede.deleteMany();

    const [bogota, medellin, cali] = await Promise.all([
        //tabla seed para crear las sedes en la base de datos.
        prisma.sede.create({
            data: {
                nombre: 'DNA Music Bogotá',
                ciudad: 'Bogotá',
                direccion: 'Calle 72 #10-07',
                estado: EstadoSede.ACTIVA,
            },
        }),
        prisma.sede.create({
            data: {
                nombre: 'DNA Music Medellín',
                ciudad: 'Medellín',
                direccion: 'Carrera 43A #1-50',
                estado: EstadoSede.ACTIVA,
            },
        }),
        prisma.sede.create({
            data: {
                nombre: 'DNA Music Cali',
                ciudad: 'Cali',
                direccion: 'Av. 6N #23-45',
                estado: EstadoSede.ACTIVA,
            },
        }),
    ]);

    console.log('Sedes creadas');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const operPassword = await bcrypt.hash('Oper123!', 12);

    await Promise.all([
        prisma.user.create({
            //tabla seed para crear los usuarios en la base de datos.
            data: {
                nombre: 'Administrador General',
                email: 'admin@dnamusic.co',
                password: adminPassword,
                role: Role.ADMIN,
                sedeId: null,
            },
        }),
        prisma.user.create({
            data: {
                nombre: 'Operador Bogotá',
                email: 'operador.bog@dnamusic.co',
                password: operPassword,
                role: Role.OPERADOR,
                sedeId: bogota.id,
            },
        }),
        prisma.user.create({
            data: {
                nombre: 'Operador Medellín',
                email: 'operador.med@dnamusic.co',
                password: operPassword,
                role: Role.OPERADOR,
                sedeId: medellin.id,
            },
        }),
    ]);

    console.log('Usuarios creados');

    await prisma.estudiante.createMany({
        //tabla seed para crear los estudiantes en la base de datos.
        data: [
            {
                nombreCompleto: 'Laura Martínez Gómez',
                email: 'laura.martinez@mail.com',
                telefono: '3001234567',
                documentoIdentidad: '1020304050',
                sedeId: bogota.id,
                programa: 'Guitarra Clásica',
                estado: EstadoEstudiante.ACTIVO,
                fechaInscripcion: new Date('2024-01-15'),
            },
            {
                nombreCompleto: 'Carlos Pérez Torres',
                email: 'carlos.perez@mail.com',
                telefono: '3109876543',
                documentoIdentidad: '1030405060',
                sedeId: bogota.id,
                programa: 'Piano Jazz',
                estado: EstadoEstudiante.ACTIVO,
                fechaInscripcion: new Date('2024-03-20'),
            },
            {
                nombreCompleto: 'Valeria Ríos Luna',
                email: 'valeria.rios@mail.com',
                telefono: '3154567890',
                documentoIdentidad: '1040506070',
                sedeId: medellin.id,
                programa: 'Canto Pop',
                estado: EstadoEstudiante.ACTIVO,
                fechaInscripcion: new Date('2024-02-10'),
            },
            {
                nombreCompleto: 'Andrés Salcedo Mora',
                email: 'andres.salcedo@mail.com',
                telefono: '3201122334',
                documentoIdentidad: '1050607080',
                sedeId: medellin.id,
                programa: 'Batería Rock',
                estado: EstadoEstudiante.INACTIVO,
                fechaInscripcion: new Date('2023-08-01'),
            },
            {
                nombreCompleto: 'Sofía Vargas Pinto',
                email: 'sofia.vargas@mail.com',
                telefono: '3167890123',
                documentoIdentidad: '1060708090',
                sedeId: cali.id,
                programa: 'Violín Clásico',
                estado: EstadoEstudiante.ACTIVO,
                fechaInscripcion: new Date('2024-04-05'),
            },
            {
                nombreCompleto: 'Miguel Ángel Castro',
                email: 'miguel.castro@mail.com',
                telefono: '3183344556',
                documentoIdentidad: '1070809100',
                sedeId: cali.id,
                programa: 'Bajo Eléctrico',
                estado: EstadoEstudiante.RETIRADO,
                fechaInscripcion: new Date('2023-05-12'),
            },
        ],
    });

    console.log('Estudiantes creados');
    console.log('');
    console.log('Seed completado. Credenciales:');
    console.log('   ADMIN    → admin@dnamusic.co        / Admin123!');
    console.log('   OPERADOR → operador.bog@dnamusic.co / Oper123!');
    console.log('   OPERADOR → operador.med@dnamusic.co / Oper123!');
}

main()
    .catch((e) => {
        console.error('Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });