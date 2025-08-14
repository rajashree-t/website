// Travel Design System Generator - Figma Plugin (no UI)
// Creates a "Design System" page with foundations and reusable components
// Base mobile frame: 390x844, Auto Layout, 8px spacing

async function main() {
	// Load required fonts
	const fontsToLoad = [
		{ family: 'Inter', style: 'Regular' },
		{ family: 'Inter', style: 'Medium' },
		{ family: 'Poppins', style: 'Bold' }
	];
	for (const f of fontsToLoad) {
		try {
			await figma.loadFontAsync(f);
		} catch (err) {
			// If a font is unavailable, fall back to Inter Regular
			if (!(f.family === 'Inter' && f.style === 'Regular')) {
				await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
			}
		}
	}

	const SPACING = 8;
	const RADIUS_MD = 12;
	const RADIUS_SM = 8;
	const ICON_SIZE = 24;
	const DEVICE_WIDTH = 390;
	const DEVICE_HEIGHT = 844;

	// Colors
	const COLORS = {
		primaryStart: '#6A5AE0',
		primaryEnd: '#00D4FF',
		accent: '#FF6B6B',
		safe: '#4CAF50',
		caution: '#FFC107',
		risk: '#F44336',
		bg: '#FFFFFF',
		bgAlt: '#F8F9FC',
		textPrimary: '#1A1A1A',
		textSecondary: '#5F6B7A'
	};

	// Helpers
	const hexToRgb = (hex) => {
		const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!m) return { r: 0, g: 0, b: 0 };
		return {
			r: parseInt(m[1], 16) / 255,
			g: parseInt(m[2], 16) / 255,
			b: parseInt(m[3], 16) / 255
		};
	};

	const solidPaint = (hex) => ({ type: 'SOLID', color: hexToRgb(hex) });

	const gradientPaint = (startHex, endHex) => ({
		type: 'GRADIENT_LINEAR',
		gradientStops: [
			{ position: 0, color: { ...hexToRgb(startHex), a: 1 } },
			{ position: 1, color: { ...hexToRgb(endHex), a: 1 } }
		],
		// Left-to-right gradient
		gradientTransform: [
			[1, 0, 0],
			[0, 1, 0]
		]
	});

	const createAutoLayoutFrame = (name, layoutMode = 'VERTICAL', opts = {}) => {
		const frame = figma.createFrame();
		frame.name = name;
		frame.layoutMode = layoutMode;
		frame.counterAxisSizingMode = 'AUTO';
		frame.primaryAxisSizingMode = 'AUTO';
		frame.itemSpacing = opts.itemSpacing ?? SPACING;
		frame.paddingTop = opts.padding ?? SPACING * 2;
		frame.paddingRight = opts.padding ?? SPACING * 2;
		frame.paddingBottom = opts.padding ?? SPACING * 2;
		frame.paddingLeft = opts.padding ?? SPACING * 2;
		frame.cornerRadius = opts.radius ?? 0;
		frame.fills = opts.fills ?? [solidPaint(COLORS.bg)];
		frame.strokes = opts.strokes ?? [];
		frame.strokeWeight = opts.strokeWeight ?? 0;
		if (opts.primaryAxisAlignItems) frame.primaryAxisAlignItems = opts.primaryAxisAlignItems;
		if (opts.counterAxisAlignItems) frame.counterAxisAlignItems = opts.counterAxisAlignItems;
		return frame;
	};

	const createAbsoluteFrame = (name, width, height, fills = [], radius = 0, strokes = [], strokeWeight = 0) => {
		const frame = figma.createFrame();
		frame.name = name;
		frame.resize(width, height);
		frame.fills = fills;
		frame.cornerRadius = radius;
		frame.strokes = strokes;
		frame.strokeWeight = strokeWeight;
		frame.clipsContent = true;
		return frame;
	};

	const createTextNode = (text, fontName, fontSize, colorHex, center = false) => {
		const t = figma.createText();
		t.characters = text;
		t.fontName = fontName;
		t.fontSize = fontSize;
		t.fills = [{ type: 'SOLID', color: hexToRgb(colorHex) }];
		if (center) t.textAlignHorizontal = 'CENTER';
		return t;
	};

	const createIconCircle = (name) => {
		const comp = figma.createComponent();
		comp.name = name;
		comp.resize(ICON_SIZE, ICON_SIZE);
		const ellipse = figma.createEllipse();
		ellipse.resize(ICON_SIZE - 2, ICON_SIZE - 2);
		ellipse.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary) }];
		ellipse.strokeWeight = 2;
		ellipse.strokeCap = 'ROUND';
		ellipse.strokeJoin = 'ROUND';
		ellipse.fills = [];
		ellipse.x = 1;
		ellipse.y = 1;
		comp.appendChild(ellipse);
		return comp;
	};

	const createColorStyle = (name, paint) => {
		const s = figma.createPaintStyle();
		s.name = name;
		s.paints = [paint];
		return s;
	};

	const createTextStyle = (name, fontName, fontSize, lineHeight) => {
		const s = figma.createTextStyle();
		s.name = name;
		s.fontName = fontName;
		s.fontSize = fontSize;
		s.lineHeight = { unit: 'PIXELS', value: lineHeight };
		return s;
	};

	const createRectangle = (w, h, fills, name = 'Rect') => {
		const r = figma.createRectangle();
		r.resize(w, h);
		r.fills = fills;
		r.name = name;
		return r;
	};

	const spacer = (w, h) => {
		const s = figma.createFrame();
		s.resize(w, h);
		s.name = 'Spacer';
		s.layoutMode = 'VERTICAL';
		s.counterAxisSizingMode = 'AUTO';
		s.primaryAxisSizingMode = 'FIXED';
		s.itemSpacing = 0;
		s.fills = [];
		s.strokes = [];
		return s;
	};

	// Ensure/Select page
	let page = figma.root.children.find(p => p.type === 'PAGE' && p.name === 'Design System');
	if (!page) {
		page = figma.createPage();
		page.name = 'Design System';
	}
	figma.currentPage = page;

	// Root Design System frame
	const ds = createAutoLayoutFrame('Design System', 'VERTICAL', { padding: 24, itemSpacing: 24, radius: 16, fills: [solidPaint(COLORS.bgAlt)] });
	page.appendChild(ds);

	// Foundations
	const foundations = createAutoLayoutFrame('Foundations', 'VERTICAL', { itemSpacing: 16, fills: [solidPaint(COLORS.bg)] });
	ds.appendChild(foundations);

	// Color styles & swatches
	const colorRow = createAutoLayoutFrame('Foundations/Colors', 'HORIZONTAL', { itemSpacing: 16, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	const stylePrimaryGradient = createColorStyle('Color/Primary Gradient', gradientPaint(COLORS.primaryStart, COLORS.primaryEnd));
	const styleAccent = createColorStyle('Color/Accent', solidPaint(COLORS.accent));
	const styleSafe = createColorStyle('Color/Safe', solidPaint(COLORS.safe));
	const styleCaution = createColorStyle('Color/Caution', solidPaint(COLORS.caution));
	const styleRisk = createColorStyle('Color/Risk', solidPaint(COLORS.risk));
	const styleBg = createColorStyle('Color/Background', solidPaint(COLORS.bg));
	const styleBgAlt = createColorStyle('Color/Background Alt', solidPaint(COLORS.bgAlt));
	const styleTextPrimary = createColorStyle('Color/Text/Primary', solidPaint(COLORS.textPrimary));
	const styleTextSecondary = createColorStyle('Color/Text/Secondary', solidPaint(COLORS.textSecondary));

	const swatch = (label, paint) => {
		const f = createAutoLayoutFrame(label, 'VERTICAL', { itemSpacing: 8, padding: 8, radius: 8, fills: [solidPaint(COLORS.bg)] });
		const rect = createRectangle(56, 56, [paint], label + '/Swatch');
		const txt = createTextNode(label, { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary, true);
		f.appendChild(rect);
		f.appendChild(txt);
		return f;
	};

	colorRow.appendChild(swatch('Primary Gradient', gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)));
	colorRow.appendChild(swatch('Accent', solidPaint(COLORS.accent)));
	colorRow.appendChild(swatch('Safe', solidPaint(COLORS.safe)));
	colorRow.appendChild(swatch('Caution', solidPaint(COLORS.caution)));
	colorRow.appendChild(swatch('Risk', solidPaint(COLORS.risk)));
	colorRow.appendChild(swatch('Background', solidPaint(COLORS.bg)));
	colorRow.appendChild(swatch('Background Alt', solidPaint(COLORS.bgAlt)));
	colorRow.appendChild(swatch('Text Primary', solidPaint(COLORS.textPrimary)));
	colorRow.appendChild(swatch('Text Secondary', solidPaint(COLORS.textSecondary)));

	foundations.appendChild(colorRow);

	// Typography styles
	const typography = createAutoLayoutFrame('Foundations/Typography', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });
	const headingStyle = createTextStyle('Typography/Heading', { family: 'Poppins', style: 'Bold' }, 24, 32);
	const bodyStyle = createTextStyle('Typography/Body', { family: 'Inter', style: 'Regular' }, 16, 24);
	const bodyMediumStyle = createTextStyle('Typography/Body Medium', { family: 'Inter', style: 'Medium' }, 16, 24);
	const caption12Style = createTextStyle('Typography/Caption/12', { family: 'Inter', style: 'Regular' }, 12, 16);
	const caption14Style = createTextStyle('Typography/Caption/14', { family: 'Inter', style: 'Regular' }, 14, 18);

	const sampleText = (label, style, text, width = 220) => {
		const f = createAutoLayoutFrame(label, 'VERTICAL', { itemSpacing: 4, padding: 8, radius: 8, fills: [solidPaint(COLORS.bg)] });
		const t = figma.createText();
		t.characters = text;
		t.textStyleId = style.id;
		t.fills = [{ type: 'SOLID', color: hexToRgb(COLORS.textPrimary) }];
		t.resizeWithoutConstraints(width, t.height);
		const cap = createTextNode(label, { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary);
		f.appendChild(t);
		f.appendChild(cap);
		return f;
	};

	typography.appendChild(sampleText('Heading (Poppins Bold)', headingStyle, 'Explore the world with AI travel planning'));
	typography.appendChild(sampleText('Body (Inter Regular)', bodyStyle, 'Plan trips, discover events, and stay safe with smart guidance.'));
	typography.appendChild(sampleText('Body (Inter Medium)', bodyMediumStyle, 'Your live trip, synced across devices.'));
	typography.appendChild(sampleText('Caption 12', caption12Style, 'Caption example 12px'));
	typography.appendChild(sampleText('Caption 14', caption14Style, 'Caption example 14px'));

	foundations.appendChild(typography);

	// Icons (rounded, 2px stroke)
	const iconsFrame = createAutoLayoutFrame('Foundations/Icons', 'HORIZONTAL', { itemSpacing: 12, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });
	const iconNames = ['Home', 'Discover', 'LiveTrip', 'Community', 'Profile', 'Search', 'Filter', 'Back', 'Upload', 'Alert', 'MapPin', 'ZoomIn', 'ZoomOut'];
	const iconComponents = [];
	for (const nm of iconNames) {
		const comp = createIconCircle(`Icon/${nm}`);
		iconsFrame.appendChild(comp);
		iconComponents.push(comp);
	}
	const getIcon = (nm) => iconComponents.find(c => c.name === `Icon/${nm}`) || iconComponents[0];
	foundations.appendChild(iconsFrame);

	// Components Section
	const components = createAutoLayoutFrame('Components', 'VERTICAL', { itemSpacing: 24, fills: [solidPaint(COLORS.bg)] });
	ds.appendChild(components);

	// Buttons
	const buttonsFrame = createAutoLayoutFrame('Buttons', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	const createButton = (name, fills, strokes = [], textColor = COLORS.bg, withIcon = false) => {
		const comp = figma.createComponent();
		comp.name = name;
		const btn = createAutoLayoutFrame(name + '/container', 'HORIZONTAL', { itemSpacing: 8, padding: 12, radius: RADIUS_MD, counterAxisAlignItems: 'CENTER' });
		btn.fills = fills;
		btn.strokes = strokes;
		btn.strokeWeight = strokes.length ? 2 : 0;
		const label = createTextNode('Continue', { family: 'Inter', style: 'Medium' }, 16, textColor);
		if (withIcon) {
			const iconInstance = getIcon('Search').createInstance();
			btn.appendChild(iconInstance);
		}
		btn.appendChild(label);
		comp.appendChild(btn);
		return comp;
	};

	const primaryButton = createButton('Button/Primary', [gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)], [], COLORS.bg, true);
	const secondaryButton = createButton('Button/Secondary', [solidPaint(COLORS.bg)], [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary) }], COLORS.textPrimary, false);
	const iconButton = figma.createComponent();
	iconButton.name = 'Button/Icon';
	const iconBtn = createAutoLayoutFrame('Button/Icon/container', 'HORIZONTAL', { itemSpacing: 0, padding: 12, radius: 999, counterAxisAlignItems: 'CENTER' });
	iconBtn.fills = [solidPaint(COLORS.bgAlt)];
	iconBtn.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary) }];
	iconBtn.strokeWeight = 1;
	const iconInside = getIcon('Search').createInstance();
	iconBtn.appendChild(iconInside);
	iconButton.appendChild(iconBtn);

	buttonsFrame.appendChild(primaryButton);
	buttonsFrame.appendChild(secondaryButton);
	buttonsFrame.appendChild(iconButton);
	components.appendChild(buttonsFrame);

	// Nav Bars
	const navBars = createAutoLayoutFrame('Nav Bars', 'VERTICAL', { itemSpacing: 16, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	// Top App Bar
	const topAppBar = figma.createComponent();
	topAppBar.name = 'NavBar/TopAppBar';
	const topBar = createAutoLayoutFrame('TopBar/container', 'HORIZONTAL', { itemSpacing: 8, padding: 12, radius: 0, primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
	topBar.resize(DEVICE_WIDTH, 56);
	topBar.fills = [solidPaint(COLORS.bg)];
	topBar.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	topBar.strokeWeight = 1;
	const leftGroup = createAutoLayoutFrame('TopBar/left', 'HORIZONTAL', { itemSpacing: 8, padding: 0, radius: 0, fills: [] });
	const backIcon = getIcon('Back').createInstance();
	const titleText = createTextNode('Explore', { family: 'Poppins', style: 'Bold' }, 20, COLORS.textPrimary);
	leftGroup.appendChild(backIcon);
	leftGroup.appendChild(titleText);
	const actions = createAutoLayoutFrame('TopBar/actions', 'HORIZONTAL', { itemSpacing: 8, padding: 0, radius: 0, fills: [] });
	const searchIcon = getIcon('Search').createInstance();
	const filterIcon = getIcon('Filter').createInstance();
	actions.appendChild(searchIcon);
	actions.appendChild(filterIcon);
	topBar.appendChild(leftGroup);
	topBar.appendChild(actions);
	topAppBar.appendChild(topBar);

	// Bottom Nav Bar
	const bottomNav = figma.createComponent();
	bottomNav.name = 'NavBar/Bottom';
	const bottomBar = createAutoLayoutFrame('BottomBar/container', 'HORIZONTAL', { itemSpacing: 16, padding: 8, radius: 16, primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
	bottomBar.resize(DEVICE_WIDTH, 72);
	bottomBar.fills = [solidPaint(COLORS.bg)];
	bottomBar.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	bottomBar.strokeWeight = 1;

	const makeTab = (label, iconName) => {
		const tab = createAutoLayoutFrame('Tab/' + label, 'VERTICAL', { itemSpacing: 4, padding: 8, radius: 8, fills: [solidPaint(COLORS.bg)], counterAxisAlignItems: 'CENTER' });
		const ic = getIcon(iconName).createInstance();
		const txt = createTextNode(label, { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary, true);
		tab.appendChild(ic);
		tab.appendChild(txt);
		return tab;
	};

	bottomBar.appendChild(makeTab('Home', 'Home'));
	bottomBar.appendChild(makeTab('Discover', 'Discover'));
	bottomBar.appendChild(makeTab('Live Trip', 'LiveTrip'));
	bottomBar.appendChild(makeTab('Community', 'Community'));
	bottomBar.appendChild(makeTab('Profile', 'Profile'));
	bottomNav.appendChild(bottomBar);

	navBars.appendChild(topAppBar);
	navBars.appendChild(bottomNav);
	components.appendChild(navBars);

	// Cards
	const cards = createAutoLayoutFrame('Cards', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	const makeCard = (name, size) => {
		const comp = figma.createComponent();
		comp.name = name;
		const frame = createAutoLayoutFrame(name + '/container', 'VERTICAL', { itemSpacing: 8, padding: 12, radius: 16 });
		frame.fills = [solidPaint(COLORS.bg)];
		frame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
		frame.strokeWeight = 1;
		frame.resize(size.w, size.h);
		const image = createRectangle(size.w - 24, Math.round(size.h * 0.55), [solidPaint(COLORS.bgAlt)], 'Image');
		image.cornerRadius = 12;
		const title = createTextNode('Sample Title', { family: 'Poppins', style: 'Bold' }, 16, COLORS.textPrimary);
		const meta = createTextNode('Subtitle • 3.2 km • 4.8★', { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary);
		frame.appendChild(image);
		frame.appendChild(title);
		frame.appendChild(meta);
		comp.appendChild(frame);
		return comp;
	};

	const cardDestination = makeCard('Card/Destination', { w: 320, h: 220 });
	const cardEvent = makeCard('Card/Event', { w: 280, h: 180 });
	const cardReview = makeCard('Card/Review', { w: 300, h: 200 });
	const cardGuide = makeCard('Card/Guide', { w: 280, h: 160 });

	cards.appendChild(cardDestination);
	cards.appendChild(cardEvent);
	cards.appendChild(cardReview);
	cards.appendChild(cardGuide);
	components.appendChild(cards);

	// Map Module
	const mapSection = createAutoLayoutFrame('Map Module', 'VERTICAL', { itemSpacing: 12, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });
	const mapComp = figma.createComponent();
	mapComp.name = 'Module/Map';
	const mapFrame = createAutoLayoutFrame('Module/Map/container', 'VERTICAL', { itemSpacing: 8, padding: 8, radius: 16 });
	mapFrame.fills = [solidPaint(COLORS.bg)];
	mapFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	mapFrame.strokeWeight = 1;
	mapFrame.resize(DEVICE_WIDTH - 32, 260);
	const mapTop = createAutoLayoutFrame('Map/top', 'HORIZONTAL', { itemSpacing: 8, padding: 0, radius: 0, fills: [], primaryAxisAlignItems: 'SPACE_BETWEEN', counterAxisAlignItems: 'CENTER' });
	const toggle = figma.createComponent();
	toggle.name = 'Toggle/OnlineOffline';
	const toggleTrack = createRectangle(52, 28, [solidPaint(COLORS.bgAlt)], 'Track');
	toggleTrack.cornerRadius = 999;
	toggleTrack.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary) }];
	toggleTrack.strokeWeight = 1;
	const toggleThumb = figma.createEllipse();
	toggleThumb.resize(24, 24);
	toggleThumb.fills = [gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)];
	toggleThumb.x = 2;
	toggleThumb.y = 2;
	const toggleFrame = createAutoLayoutFrame('Toggle/container', 'HORIZONTAL', { itemSpacing: 0, padding: 2, radius: 999, fills: [solidPaint(COLORS.bgAlt)], counterAxisAlignItems: 'CENTER' });
	toggleFrame.appendChild(toggleTrack);
	toggleFrame.appendChild(toggleThumb);
	toggle.appendChild(toggleFrame);
	const mapTitle = createTextNode('Map (Online)', { family: 'Inter', style: 'Medium' }, 14, COLORS.textPrimary);
	mapTop.appendChild(mapTitle);
	mapTop.appendChild(toggle.createInstance());

	// Canvas with absolute children
	const canvasWidth = mapFrame.width - 16;
	const canvasHeight = 180;
	const mapCanvas = createAbsoluteFrame('Map/canvas', canvasWidth, canvasHeight, [solidPaint('#E6EAF2')], 12, [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }], 1);
	// Pins
	for (let i = 0; i < 5; i++) {
		const pin = figma.createEllipse();
		pin.resize(12, 12);
		pin.fills = [solidPaint(COLORS.accent)];
		pin.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bg) }];
		pin.strokeWeight = 2;
		pin.x = 12 + i * 24;
		pin.y = 12 + (i % 2) * 24;
		mapCanvas.appendChild(pin);
	}
	// Safety overlay (placeholder)
	const overlay = createRectangle(canvasWidth, canvasHeight, [{ type: 'SOLID', color: { ...hexToRgb(COLORS.safe), a: 0.08 } }], 'Safety Overlay');
	overlay.cornerRadius = 12;
	overlay.x = 0;
	overlay.y = 0;
	mapCanvas.appendChild(overlay);
	// Zoom controls
	const zoom = createAutoLayoutFrame('Map/zoom', 'VERTICAL', { itemSpacing: 4, padding: 6, radius: 12, fills: [solidPaint(COLORS.bg)], counterAxisAlignItems: 'CENTER' });
	zoom.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	zoom.strokeWeight = 1;
	zoom.appendChild(getIcon('ZoomIn').createInstance());
	zoom.appendChild(getIcon('ZoomOut').createInstance());
	zoom.x = canvasWidth - 40;
	zoom.y = canvasHeight - 64;
	mapCanvas.appendChild(zoom);

	mapFrame.appendChild(mapTop);
	mapFrame.appendChild(mapCanvas);
	mapComp.appendChild(mapFrame);
	mapSection.appendChild(mapComp);
	components.appendChild(mapSection);

	// Indicators
	const indicators = createAutoLayoutFrame('Indicators', 'HORIZONTAL', { itemSpacing: 16, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	// Safety Badge (variants by level)
	const badgeSafe = figma.createComponent();
	badgeSafe.name = 'Indicator/SafetyBadge';
	const pill = createAutoLayoutFrame('Badge/container', 'HORIZONTAL', { itemSpacing: 8, padding: 8, radius: 999, counterAxisAlignItems: 'CENTER' });
	pill.fills = [{ type: 'SOLID', color: { ...hexToRgb(COLORS.safe), a: 0.15 } }];
	pill.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.safe) }];
	pill.strokeWeight = 1;
	const safeDot = figma.createEllipse(); safeDot.resize(8,8); safeDot.fills = [solidPaint(COLORS.safe)];
	const safeTxt = createTextNode('Safe', { family: 'Inter', style: 'Medium' }, 12, COLORS.safe);
	pill.appendChild(safeDot);
	pill.appendChild(safeTxt);
	badgeSafe.appendChild(pill);

	const badgeCaution = badgeSafe.clone(); badgeCaution.name = 'Indicator/SafetyBadge Caution';
	badgeCaution.findAll().forEach(node => {
		if ('fills' in node) {
			if (node.name === 'Badge/container') {
				node.fills = [{ type: 'SOLID', color: { ...hexToRgb(COLORS.caution), a: 0.15 } }];
				node.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.caution) }];
			}
			if (node.type === 'ELLIPSE') node.fills = [solidPaint(COLORS.caution)];
		}
		if (node.type === 'TEXT') node.fills = [{ type: 'SOLID', color: hexToRgb(COLORS.caution) }];
	});

	const badgeRisk = badgeSafe.clone(); badgeRisk.name = 'Indicator/SafetyBadge Risk';
	badgeRisk.findAll().forEach(node => {
		if ('fills' in node) {
			if (node.name === 'Badge/container') {
				node.fills = [{ type: 'SOLID', color: { ...hexToRgb(COLORS.risk), a: 0.15 } }];
				node.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.risk) }];
			}
			if (node.type === 'ELLIPSE') node.fills = [solidPaint(COLORS.risk)];
		}
		if (node.type === 'TEXT') node.fills = [{ type: 'SOLID', color: hexToRgb(COLORS.risk) }];
	});

	indicators.appendChild(badgeSafe);
	indicators.appendChild(badgeCaution);
	indicators.appendChild(badgeRisk);

	// Offline Banner
	const offlineBanner = figma.createComponent();
	offlineBanner.name = 'Indicator/OfflineBanner';
	const banner = createAutoLayoutFrame('Banner/container', 'HORIZONTAL', { itemSpacing: 8, padding: 12, radius: 12, counterAxisAlignItems: 'CENTER' });
	banner.fills = [{ type: 'SOLID', color: { ...hexToRgb(COLORS.accent), a: 0.1 } }];
	banner.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.accent) }];
	banner.strokeWeight = 1;
	const alertIcon = getIcon('Alert').createInstance();
	const bannerText = createTextNode('You are offline. Some features may be unavailable.', { family: 'Inter', style: 'Medium' }, 12, COLORS.accent);
	banner.appendChild(alertIcon);
	banner.appendChild(bannerText);
	offlineBanner.appendChild(banner);
	indicators.appendChild(offlineBanner);

	// Alert Modal
	const alertModal = figma.createComponent();
	alertModal.name = 'Modal/Alert';
	const modal = createAutoLayoutFrame('Modal/container', 'VERTICAL', { itemSpacing: 12, padding: 16, radius: 16 });
	modal.fills = [solidPaint(COLORS.bg)];
	modal.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	modal.strokeWeight = 1;
	modal.resize(320, 200);
	const modalTitle = createTextNode('Enable Location?', { family: 'Poppins', style: 'Bold' }, 18, COLORS.textPrimary);
	const modalBody = createTextNode('To show live safety info and nearby events, allow location access.', { family: 'Inter', style: 'Regular' }, 14, COLORS.textSecondary);
	modalBody.resize(288, modalBody.height);
	const modalActions = createAutoLayoutFrame('Modal/actions', 'HORIZONTAL', { itemSpacing: 8, padding: 0, radius: 0, fills: [], counterAxisAlignItems: 'CENTER' });
	modalActions.appendChild(secondaryButton.createInstance());
	modalActions.appendChild(primaryButton.createInstance());
	modal.appendChild(modalTitle);
	modal.appendChild(modalBody);
	modal.appendChild(modalActions);
	alertModal.appendChild(modal);
	indicators.appendChild(alertModal);

	components.appendChild(indicators);

	// Forms & Filters
	const forms = createAutoLayoutFrame('Forms & Filters', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	// Search Bar
	const searchBar = figma.createComponent();
	searchBar.name = 'Form/SearchBar';
	const searchFrame = createAutoLayoutFrame('Search/container', 'HORIZONTAL', { itemSpacing: 8, padding: 12, radius: 12, counterAxisAlignItems: 'CENTER' });
	searchFrame.fills = [solidPaint(COLORS.bg)];
	searchFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	searchFrame.strokeWeight = 1;
	searchFrame.resize(320, 48);
	searchFrame.appendChild(getIcon('Search').createInstance());
	const searchPlaceholder = createTextNode('Search destinations, guides...', { family: 'Inter', style: 'Regular' }, 14, COLORS.textSecondary);
	searchFrame.appendChild(searchPlaceholder);
	searchBar.appendChild(searchFrame);

	// Filter Chip (variants)
	const chipDefault = figma.createComponent();
	chipDefault.name = 'Filter/Chip';
	const chipBase = createAutoLayoutFrame('Chip/container', 'HORIZONTAL', { itemSpacing: 8, padding: 8, radius: 999, counterAxisAlignItems: 'CENTER' });
	chipBase.fills = [solidPaint(COLORS.bg)];
	chipBase.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary) }];
	chipBase.strokeWeight = 1;
	const chipText = createTextNode('Outdoors', { family: 'Inter', style: 'Regular' }, 12, COLORS.textPrimary);
	chipBase.appendChild(chipText);
	chipDefault.appendChild(chipBase);

	const chipSelected = chipDefault.clone(); chipSelected.name = 'Filter/Chip Selected';
	chipSelected.findAll().forEach(node => {
		if ('fills' in node && node.name === 'Chip/container') node.fills = [gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)];
		if (node.type === 'TEXT') node.fills = [{ type: 'SOLID', color: hexToRgb(COLORS.bg) }];
	});

	// Slider (absolute elements)
	const slider = figma.createComponent();
	slider.name = 'Filter/Slider';
	const sliderWrap = createAbsoluteFrame('Slider/container', 240, 24, [], 0, [], 0);
	const track = createRectangle(240, 4, [solidPaint(COLORS.bgAlt)], 'Track');
	track.cornerRadius = 999;
	track.x = 0; track.y = 10;
	const fill = createRectangle(120, 4, [gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)], 'Fill');
	fill.cornerRadius = 999;
	fill.x = 0; fill.y = 10;
	const thumb = figma.createEllipse(); thumb.resize(16,16); thumb.fills = [solidPaint(COLORS.bg)]; thumb.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.textSecondary)}]; thumb.strokeWeight = 1; thumb.x = 112; thumb.y = 6;
	sliderWrap.appendChild(track);
	sliderWrap.appendChild(fill);
	sliderWrap.appendChild(thumb);
	slider.appendChild(sliderWrap);

	forms.appendChild(searchBar);
	forms.appendChild(chipDefault);
	forms.appendChild(chipSelected);
	forms.appendChild(slider);
	components.appendChild(forms);

	// Media
	const media = createAutoLayoutFrame('Media', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });
	// Upload Tile
	const uploadTile = figma.createComponent();
	uploadTile.name = 'Media/UploadTile';
	const upFrame = createAutoLayoutFrame('Upload/container', 'VERTICAL', { itemSpacing: 8, padding: 16, radius: 12, counterAxisAlignItems: 'CENTER' });
	upFrame.resize(140, 120);
	upFrame.fills = [solidPaint(COLORS.bg)];
	upFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	upFrame.strokeWeight = 1;
	const plusIcon = getIcon('Upload').createInstance();
	const upText = createTextNode('Upload Photo/Video', { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary, true);
	upFrame.appendChild(plusIcon);
	upFrame.appendChild(upText);
	uploadTile.appendChild(upFrame);
	// Gallery Carousel
	const gallery = figma.createComponent();
	gallery.name = 'Media/GalleryCarousel';
	const galFrame = createAutoLayoutFrame('Gallery/container', 'HORIZONTAL', { itemSpacing: 8, padding: 8, radius: 12 });
	galFrame.fills = [solidPaint(COLORS.bg)];
	galFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	galFrame.strokeWeight = 1;
	for (let i = 0; i < 3; i++) {
		const ph = createRectangle(96, 72, [solidPaint(COLORS.bgAlt)], 'Photo'); ph.cornerRadius = 8; galFrame.appendChild(ph);
	}
	gallery.appendChild(galFrame);

	media.appendChild(uploadTile);
	media.appendChild(gallery);
	components.appendChild(media);

	// AI Modules
	const ai = createAutoLayoutFrame('AI Modules', 'HORIZONTAL', { itemSpacing: 24, padding: 16, radius: 12, fills: [solidPaint(COLORS.bgAlt)] });

	// Review Summary
	const reviewSummary = figma.createComponent();
	reviewSummary.name = 'AI/ReviewSummary';
	const rs = createAutoLayoutFrame('ReviewSummary/container', 'VERTICAL', { itemSpacing: 8, padding: 12, radius: 12 });
	rs.fills = [solidPaint(COLORS.bg)];
	rs.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	rs.strokeWeight = 1;
	const rsTitle = createTextNode('AI Review Summary', { family: 'Poppins', style: 'Bold' }, 16, COLORS.textPrimary);
	const rsBody = createTextNode('• Great for families\n• Best in spring\n• Nearby hiking trails\n• High safety rating', { family: 'Inter', style: 'Regular' }, 12, COLORS.textSecondary);
	rs.appendChild(rsTitle);
	rs.appendChild(rsBody);
	reviewSummary.appendChild(rs);

	// Loading Animation (static representation)
	const loading = figma.createComponent();
	loading.name = 'AI/LoadingAnimation';
	const loadFrame = createAutoLayoutFrame('Loading/container', 'HORIZONTAL', { itemSpacing: 8, padding: 16, radius: 999 });
	loadFrame.fills = [solidPaint(COLORS.bg)];
	loadFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	loadFrame.strokeWeight = 1;
	for (let i = 0; i < 3; i++) { const dot = figma.createEllipse(); dot.resize(12, 12); dot.fills = [gradientPaint(COLORS.primaryStart, COLORS.primaryEnd)]; loadFrame.appendChild(dot); }
	loading.appendChild(loadFrame);

	// Suggestions Carousel
	const suggestions = figma.createComponent();
	suggestions.name = 'AI/SuggestionsCarousel';
	const sFrame = createAutoLayoutFrame('Suggestions/container', 'HORIZONTAL', { itemSpacing: 8, padding: 8, radius: 12 });
	sFrame.fills = [solidPaint(COLORS.bg)];
	sFrame.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	sFrame.strokeWeight = 1;
	const makeSuggestion = (label) => {
		const chip = createAutoLayoutFrame('Suggestion', 'HORIZONTAL', { itemSpacing: 8, padding: 8, radius: 999 });
		chip.fills = [solidPaint(COLORS.bgAlt)];
		chip.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
		chip.strokeWeight = 1;
		chip.appendChild(createTextNode(label, { family: 'Inter', style: 'Regular' }, 12, COLORS.textPrimary));
		return chip;
	};
	['3-day Tokyo', 'Family-friendly', 'Hike near Kyoto', 'Nightlife Shibuya'].forEach(l => sFrame.appendChild(makeSuggestion(l)));
	suggestions.appendChild(sFrame);

	ai.appendChild(reviewSummary);
	ai.appendChild(loading);
	ai.appendChild(suggestions);
	components.appendChild(ai);

	// Base Device Frame 390x844 (with top/bottom bars)
	const deviceComp = figma.createComponent();
	deviceComp.name = 'Frame/Device/Base';
	const device = createAutoLayoutFrame('Device/container', 'VERTICAL', { itemSpacing: 8, padding: 0, radius: 28 });
	device.resize(DEVICE_WIDTH, DEVICE_HEIGHT);
	device.fills = [solidPaint(COLORS.bg)];
	device.strokes = [{ type: 'SOLID', color: hexToRgb(COLORS.bgAlt) }];
	device.strokeWeight = 1;
	// Header
	device.appendChild(topAppBar.createInstance());
	const content = createAutoLayoutFrame('Device/content', 'VERTICAL', { itemSpacing: 8, padding: 16, radius: 0, fills: [] });
	content.resize(DEVICE_WIDTH, DEVICE_HEIGHT - 56 - 72);
	const contentPlaceholder = createRectangle(DEVICE_WIDTH - 32, DEVICE_HEIGHT - 56 - 72 - 32, [solidPaint(COLORS.bgAlt)], 'Content');
	contentPlaceholder.cornerRadius = 12;
	content.appendChild(contentPlaceholder);
	device.appendChild(content);
	// Footer
	device.appendChild(bottomNav.createInstance());
	deviceComp.appendChild(device);
	ds.appendChild(deviceComp);

	// Done
	figma.viewport.scrollAndZoomIntoView([ds]);
	figma.notify('Design System created');
	figma.closePlugin();
}

main();