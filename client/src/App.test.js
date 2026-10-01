import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const PRODUCTOS = [
  { id: 'mesa-pampa', nombre: 'Mesa Comedor Pampa', precio: 250000, categoria: 'Mesas', destacado: true, imagen: 'assets/img/productos/Mesa_Comedor_Pampa.png' },
  { id: 'silla-cordoba', nombre: 'Sillas Córdoba', precio: 80000, categoria: 'Asientos', destacado: false, imagen: 'assets/img/productos/Sillas_Cordoba.png' }
];

beforeEach(() => {
  // jsdom no implementa scrollTo
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('muestra "cargando", luego la lista y el detalle al hacer click', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => PRODUCTOS });
  render(<App />);

  expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/productos', expect.anything());

  fireEvent.click(screen.getByRole('link', { name: 'Catálogo' }));
  expect(await screen.findByText('Mesa Comedor Pampa')).toBeInTheDocument();
  expect(screen.getByText('Sillas Córdoba')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Sillas Córdoba'));
  expect(screen.getByRole('heading', { level: 1, name: 'Sillas Córdoba' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /volver al catálogo/i }));
  expect(screen.getByText('Mesa Comedor Pampa')).toBeInTheDocument();
});

test('muestra un error si la API responde con un status no-ok y permite reintentar', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ ok: false, status: 500 })
    .mockResolvedValueOnce({ ok: true, json: async () => PRODUCTOS });
  render(<App />);

  expect(await screen.findByText(/no pudimos cargar los productos/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
  expect(await screen.findByText('Mesa Comedor Pampa')).toBeInTheDocument();
});
