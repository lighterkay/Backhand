import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

const BRANCHES = [
  { name: 'Steakz Centro',      address: 'Calle Mayor 1, Centro' },
  { name: 'Steakz Norte',       address: 'Avenida Norte 45, Distrito Norte' },
  { name: 'Steakz Sur',         address: 'Calle Sur 88, Barrio Sur' },
  { name: 'Steakz Este',        address: 'Calle Este 12, Cuartel Este' },
  { name: 'Steakz Oeste',       address: 'Calle Oeste 200, Centro Comercial Oeste' },
  { name: 'Steakz Marina',      address: 'Paseo Marítimo 9, Marina' },
  { name: 'Steakz Alta Vista',  address: 'Avenida de la Vista 77, Altura' },
];

const MENU_ITEMS = [
  { name: 'Ribeye Steak', description: 'Premium aged 16oz ribeye', price: 38.99, category: 'Steaks' },
  { name: 'Filet Mignon', description: 'Tender 8oz filet', price: 42.99, category: 'Steaks' },
  { name: 'New York Strip', description: 'Classic 12oz strip steak', price: 35.99, category: 'Steaks' },
  { name: 'T-Bone', description: 'Bone-in 18oz t-bone', price: 44.99, category: 'Steaks' },
  { name: 'Caesar Salad', description: 'Crisp romaine with house dressing', price: 12.99, category: 'Salads' },
  { name: 'Garden Salad', description: 'Fresh mixed greens', price: 10.99, category: 'Salads' },
  { name: 'Garlic Bread', description: 'Toasted with fresh garlic butter', price: 6.99, category: 'Sides' },
  { name: 'Grilled Vegetables', description: 'Seasonal vegetables', price: 7.99, category: 'Sides' },
  { name: 'Mashed Potatoes', description: 'Creamy and buttery', price: 5.99, category: 'Sides' },
  { name: 'Chocolate Lava Cake', description: 'Warm with ice cream', price: 8.99, category: 'Desserts' },
  { name: 'Cheesecake', description: 'New York style', price: 7.99, category: 'Desserts' },
  { name: 'House Wine', description: 'Red or white', price: 28.00, category: 'Drinks' },
  { name: 'Craft Beer', description: 'Selection of local brews', price: 7.00, category: 'Drinks' },
];

export async function seed() {
  const email    = process.env['ADMIN_EMAIL']    ?? 'admin@steakz.com';
  const password = process.env['ADMIN_PASSWORD'] ?? 'admin123';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name: 'System Admin', email, password: hashed, role: 'ADMIN' },
    });
    console.log(`[Seeder] Admin created: ${email}`);
  } else {
    console.log('[Seeder] Admin already exists - skipping.');
  }

  for (const b of BRANCHES) {
    let branch = await prisma.branch.findUnique({ where: { name: b.name } });
    if (!branch) {
      branch = await prisma.branch.create({ data: b });
      console.log(`[Seeder] Branch created: ${b.name}`);
    }
    
    // Ensure menu items exist for this branch
    const existingItems = await prisma.menuItem.count({ where: { branchId: branch.id } });
    if (existingItems === 0) {
      for (const item of MENU_ITEMS) {
        await prisma.menuItem.create({
          data: {
            ...item,
            branchId: branch.id,
            isAvailable: true,
          },
        });
      }
      console.log(`[Seeder] Added ${MENU_ITEMS.length} menu items to ${b.name}`);
    }
  }
}

