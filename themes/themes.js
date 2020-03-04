class Themes {
	constructor() {
		this.guestLibs = {
			bootstrap_css: node_modules + '/bootstrap/dist/css/bootstrap.min.css',
			jquery_js: node_modules + '/jquery/dist/jquery.min.js',
			jquery_slim_js: node_modules + '/jquery/dist/jquery.slim.min.js',
			material_design_icons_css: node_modules + '/material-design-icons-iconfont/dist/material-design-icons.css',
			three_js: node_modules + '/three/build/three.min.js'
		};
		this.initialized = false;
	}

	async init() {
		let imgTypes = [
			`box`, // the front of the box
			`boxBack`, // the back of the box
			`boxSide`, // the side of the box
			`boxOpen`, // the inside of the game's box
			`boxOpenMask`, // parts of the game's box, such as manual clips, that should appear above the game media, manual, and memory card
			`cart`, // the front of the game's (first) cartridge
			`cover`, // the front facing portion of the cover sleeve, no box
			`coverFull`, // the entire cover sleeve, no box
			`coverBack`, // the side facing portion of the cover sleeve, no box
			`coverSide`, // the side facing portion of the cover sleeve, no box
			`disc`, // the front of the game's (first) disc
			`manual`, // the front of the game's manual
			`memory`, // the front of a memory card
			`memoryBack`, // the back of a memory card
			`promo` // a promotional insert included in the game box
		];
		let systems = [
			'ds', 'gba', 'gcn', 'mame', 'n3ds', 'ps2', 'ps3',
			'snes', 'switch', 'wii', 'wiiu', 'xbox360'
		];
		// template game art
		for (let system of systems) {
			let template = {
				id: '_TEMPLATE_' + system,
				title: system + ' template',
				img: {},
				sys: system
			};
			for (let imgType of imgTypes) {
				template.img[imgType] = 'q';
			}
			this[system] = {};
			this[system].template = template;
			this[system].default = {
				"img": {
					"box": "q",
					"boxBack": "q",
					"boxSide": "q"
				}
			};
		}
		// the default game art
		this.ds.default.id = "ASME";
		this.ds.default.title = "Super Mario 64 DS";
		this.gba.default.id = "84EE4776";
		this.gba.default.title = "Pokemon: Fire Red Version";
		this.gcn.default.id = "GALE01";
		this.gcn.default.title = "Super Smash Bros. Melee";
		this.n3ds.default.id = "AREE";
		this.n3ds.default.title = "Super Mario 3D Land";
		this.ps2.default.id = "SLUS20370";
		this.ps2.default.title = "Kingdom Hearts";
		this.ps3.default.id = "BCUS98154";
		this.ps3.default.title = "inFamous";
		this.snes.default = this.snes.template;
		this.switch.default.id = "AAACA";
		this.switch.default.title = "Super Mario Odyssey";
		this.wii.default.id = "SB4E01";
		this.wii.default.title = "Super Mario Galaxy 2";
		this.wiiu.default.id = "ARDE01";
		this.wiiu.default.title = "Super Mario 3D World";
		this.xbox360.default.id = "4D5307E6";
		this.xbox360.default.title = "Halo 3";

		this.initialized = true;
	}

	async loadFrame(name) {
		if (!this.initialized) await this.init();
		let themeDir = `${prefs.nlaDir}/themes/${sysStyle}`;
		if (!(await fs.exists(`${themeDir}/${name}.html`))) {
			themeDir = `${__root}/themes/${sysStyle}`;
		}
		let fileHtml = `${themeDir}/${name}.html`;
		let filePug = `${themeDir}/${name}.pug`;
		if (!(await fs.exists(fileHtml))) {
			log('generating html from pug file');
			let filePugContent = await fs.readFile(filePug, 'utf8');
			await fs.outputFile(fileHtml, pug(filePugContent, this.guestLibs));
		}
		$('body').prepend(`<webview id="${name}" enableremotemodule="false" src="${fileHtml}"></webview>`);
	}

	async applyStyle(name) {
		if (!this.initialized) await this.init();
		let dirs = [__root, prefs.nlaDir];
		let systems = [sys];
		if (sys == 'wii') systems.push('gcn');
		for (let i in dirs) {
			for (let _sys of systems) {
				let file = `${dirs[i]}/themes/${_sys}/${name}.css`;
				if (i != 0 && !(await fs.exists(file))) {
					try {
						await fs.ensureFile(file);
					} catch (ror) {
						er(ror);
						continue;
					}
				}
				$('body').prepend(`<link rel="stylesheet" type="text/css" href="${file}">`);
			}
		}
	}

}

module.exports = new Themes();
