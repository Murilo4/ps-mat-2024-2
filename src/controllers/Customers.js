import prisma from '../database/client.js';
import Customer from '../models/customer.js';
import { ZodError } from 'zod';

const controller = {};

controller.create = async function (req, res) {
  try {
    const validatedData = Customer.parse(req.body);

    await prisma.customer.create({ data: validatedData });

    res.status(201).end();
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(422).json({
        message: 'Erro de validação',
        errors: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    res.status(500).end();
  }
};

// Método para buscar todos os clientes
controller.retrieveAll = async function (req, res) {
  try {
    const result = await prisma.customer.findMany({
      orderBy: [{ name: 'asc' }],
      include: {
        cars: req.query.include === 'cars',
      },
    });

    res.send(result);
  } catch (error) {
    console.error(error);

    res.status(500).end();
  }
};

// Método para buscar um cliente específico
controller.retrieveOne = async function (req, res) {
  try {
    const result = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        cars: req.query.include === 'cars',
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
    const validatedData = Customer.parse(req.body);

    const result = await prisma.customer.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
    });


    if (result) res.status(204).end()
    else res.status(404).end();
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return res.status(422).json({
        message: 'Erro de validação',
        errors: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    res.status(500).end();
  }
};

// Método para deletar um cliente
controller.delete = async function (req, res) {
  try {
    await prisma.customer.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      console.error(error);

      res.status(500).end();
    }
  }
};

export default controller;