export const modulesAndRoles = {
	modul: [
		{
			id_module: 1,
			name: 'Faktury',
			main: true,
			over_id: 1,
		},
		{
			id_module: 2,
			name: 'Jakies tam uprawnienie 1',
			main: false,
			over_id: 1,
		},
		{
			id_module: 3,
			name: 'Jakies tam uprawnienie 2',
			main: false,
			over_id: 1,
		},
		
	],
	role: [
		{
			id_role: 12,
			name: 'Admin',
			roles: [
				{
					id_role_module: 1,
					id_module: 2,
					access: true,
				},
				{
					id_role_module: 2,
					id_module: 3,
					access: true,
				},
			],
		},
		{
			id_role: 14,
			name: 'Programista',
			roles: [
				{
					id_role_module: 3,
					id_module: 2,
					access: true,
				},
				{
					id_role_module: 4,
					id_module: 3,
					access: true,
				},
			],
		},
		
	],
}
