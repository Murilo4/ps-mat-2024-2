import prisma from '../database/client.js';
import car from '../models/car.js';
import { z } from 'zod';

const controller = {};

controller.create = async function (req, res) {
  try {
    // Validação usando Zod
    const validatedData = car.parse(req.body);

    validatedData.created_user_id = req.authUser.id;

    validatedData.updated_user_id = req.authUser.id;

    await prisma.car.create({ data: validatedData });

    // HTTP 201: Created
    res.status(201).end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        message: 'Erro de validação',
        errors: formattedErrors,
      });
    }

    console.error(error);

    res.status(500).end();
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    const includedRels = req.query.include?.split(',') ?? [];

    const result = await prisma.car.findMany({
      orderBy: [
        { brand: 'asc' },
        { model: 'asc' },
        { id: 'asc' },
      ],
      include: {
        customer: includedRels.includes('customer'),
        created_user: includedRels.includes('created_user'),
        updated_user: includedRels.includes('updated_user'),
      },
    });

    res.send(result);
  } catch (error) {
    console.error(error);

    res.status(500).end();
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const includedRels = req.query.include?.split(',') ?? [];

    const result = await prisma.car.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        customer: includedRels.includes('customer'),
        created_user: includedRels.includes('created_user'),
        updated_user: includedRels.includes('updated_user'),
      },
    });

    if (result) res.send(result);
    else res.status(404).end();
  } catch (error) {
    console.error(error);

    res.status(500).end();
  }
};

controller.update = async function (req, res) {
  try {
    req.body.updated_user_id = req.authUser.id;

    const validatedData = schema.parse(req.body);

    const result = await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
    });

    if (result) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        message: 'Erro de validação',
        errors: formattedErrors,
      });
    }

    console.error(error);

    res.status(500).end();
  }
};

controller.delete = async function (req, res) {
  try {
    await prisma.car.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      // Outros tipos de erro
      console.error(error);
      res.status(500).end();
    }
  }
};

export default controller;