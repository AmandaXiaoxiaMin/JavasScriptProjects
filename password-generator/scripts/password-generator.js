let character = 'lower-case';
let specialCharacter = 'yes';
let number = 'yes';
let passwordLen = Number(document.querySelector('.password-length-select').value);
let errorMsg = '';
let password = '';
let timeoutId = [];

addAllEventListeners();

function addAllEventListeners() {
	// add event listener for generate button
	document.querySelector('.js-generate-button').addEventListener('click', () => {
		const checkResult = checkMandatoryInput();
		document.querySelector('.error-msg').innerHTML = errorMsg;
		if (!checkResult) {
			password = '';
			document.querySelector('.js-password').innerHTML = password;
			updateCopyHTML(false);
			return;
		}
		password = generatePassword();
		updatePasswordHTML();
		updateCopyHTML(true);
	});

	// add event listener for password length selector
	document.querySelector('.password-length-select').addEventListener('change', () => {
		passwordLen = document.querySelector('.password-length-select').value;
	});

	// add event listensers for character checkboxes
	const lowerCaseCheckbox = document.querySelector('.js-lower-case');
	lowerCaseCheckbox.addEventListener('click', () => {
		updateCharacter(lowerCaseCheckbox);
		updateCharacterHTML(lowerCaseCheckbox.value, lowerCaseCheckbox.checked, 'character');
	});

	const upperCaseCheckbox = document.querySelector('.js-upper-case');
	upperCaseCheckbox.addEventListener('click', () => {
		updateCharacter(upperCaseCheckbox);
		updateCharacterHTML(upperCaseCheckbox.value, upperCaseCheckbox.checked, 'character');
	});

	const bothCheckbox = document.querySelector('.js-both');
	bothCheckbox.addEventListener('click', () => {
		updateCharacter(bothCheckbox);
		updateCharacterHTML(bothCheckbox.value, bothCheckbox.checked, 'character');
	});

	// add event listensers for number checkboxes
	const yesNumCheckbox = document.querySelector('.js-number-yes');
	yesNumCheckbox.addEventListener('click', () => {
		updateNumber(yesNumCheckbox);
		updateCharacterHTML(yesNumCheckbox.value, yesNumCheckbox.checked, 'number');
	});

	const noNumCheckbox = document.querySelector('.js-number-no');
	noNumCheckbox.addEventListener('click', () => {
		updateNumber(noNumCheckbox);
		updateCharacterHTML(noNumCheckbox.value, noNumCheckbox.checked, 'number');
	});

	// add event listensers for special character checkboxes
	const yesSpecialCheckbox = document.querySelector('.js-special-character-yes');
	yesSpecialCheckbox.addEventListener('click', () => {
		updateSpecialCharacter(yesSpecialCheckbox);
		updateCharacterHTML(yesSpecialCheckbox.value, yesSpecialCheckbox.checked, 'special-character');
	});

	const noSpecialCheckbox = document.querySelector('.js-special-character-no');
	noSpecialCheckbox.addEventListener('click', () => {
		updateSpecialCharacter(noSpecialCheckbox);
		updateCharacterHTML(noSpecialCheckbox.value, noSpecialCheckbox.checked, 'special-character');
	});

	// add event listeners for copy
	document.querySelector('.js-copy-password').addEventListener('click', () => {
		navigator.clipboard.writeText(password);
		document.querySelector('.js-tiptool').classList.add('show-tiptool');
		if (timeoutId.length === 1) {
			clearTimeout(timeoutId[0]);
			timeoutId.pop();
		}
		const id = setTimeout(() => {
			document.querySelector('.js-tiptool').classList.remove('show-tiptool');
		}, 2000);
		timeoutId.push(id);
	});
}

function checkMandatoryInput() {
	if (character === '' || specialCharacter === '') {
		errorMsg = '&#9888; Please check mandatory fields.';
		return false;
	} else {
		errorMsg = '';
		return true;
	}
}

function updateCharacter(checkbox) {
	if (checkbox.checked) {
		character = checkbox.value;
	} else {
		character = '';
	}
}

function updateSpecialCharacter(checkbox) {
	if (checkbox.checked) {
		specialCharacter = checkbox.value;
	} else {
		specialCharacter = '';
	}
}

function updateNumber(checkbox) {
	if (checkbox.checked) {
		number = checkbox.value;
	} else {
		number = '';
	}
}

function updateCharacterHTML(value, checked, characterCategory) {
	if (checked) {
		document.querySelectorAll(`.js-${characterCategory}-checkbox`).forEach((checkbox) => {
			if (checkbox.value !== value) {
				checkbox.checked = false;
			}
		});
	}
}

function generatePassword() {
	let lowerCasePosition = -1;
	let upperCasePosition = -1;
	let numberPosition = -1;
	let specialCharacterPosition = -1;

	let password = '';

	if (character === 'both') {
		lowerCasePosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
		upperCasePosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
	} else if (character === 'lower-case') {
		lowerCasePosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
	} else {
		upperCasePosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
	}

	if (number === 'yes') {
		numberPosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
	}

	if (specialCharacter === 'yes') {
		specialCharacterPosition = getPosition(
			lowerCasePosition,
			upperCasePosition,
			specialCharacterPosition,
			numberPosition
		);
	}

	let range = [];
	for (let i = 32; i <= 126; i++) {
		if (character === 'lower-case' && i >= 65 && i <= 90) continue;
		if (character == 'upper-case' && i >= 97 && i <= 122) continue;
		if (number === 'no' && i >= 48 && i <= 57) continue;
		if (
			specialCharacter === 'no' &&
			((i >= 32 && i <= 64) || (i >= 91 && i <= 96) || (i >= 123 && i <= 126))
		)
			continue;

		range.push(i);
	}

	for (let i = 0; i < passwordLen; i++) {
		if (i === lowerCasePosition) {
			password += String.fromCharCode(getCharacter(97, 122));
		} else if (i === upperCasePosition) {
			password += String.fromCharCode(getCharacter(65, 90));
		} else if (i === numberPosition) {
			password += String.fromCharCode(getCharacter(48, 57));
		} else if (i === specialCharacterPosition) {
			password += String.fromCharCode(getSpecialCharacter());
		} else {
			password += String.fromCharCode(getCharacterfromRange(range));
		}
	}

	return password;
}

function updatePasswordHTML() {
	let display = '';
	for (let char of password) {
		if (char === '&') {
			display += '&amp;';
		} else if (char === '<') {
			display += '&lt;';
		} else if (char === '>') {
			display += '&gt;';
		} else if (char === ' ') {
			display += '&nbsp;';
		} else {
			display += char;
		}
	}
	document.querySelector('.js-password').innerHTML = display;
}

function updateCopyHTML(showCopy) {
	if (showCopy) {
		document.querySelector('.js-copy-password').classList.add('show-copy');
	} else {
		document.querySelector('.js-copy-password').classList.remove('show-copy');
	}
}

function getPosition(
	lowerCasePosition,
	upperCasePosition,
	specialCharacterPosition,
	numberPosition
) {
	while (true) {
		const position = Math.floor(Math.random() * (passwordLen - 1));
		if (
			position !== lowerCasePosition &&
			position != upperCasePosition &&
			position != specialCharacterPosition &&
			position != numberPosition
		)
			return position;
	}
}

function getCharacter(start, end) {
	return Math.floor(Math.random() * (end - start + 1)) + start;
}

function getSpecialCharacter() {
	const specialCharacters = [
		32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91,
		92, 93, 94, 95, 96, 123, 124, 125, 126,
	];
	const index = Math.floor(Math.random() * (specialCharacters.length - 1));
	return specialCharacters[index];
}

function getCharacterfromRange(range) {
	const index = Math.floor(Math.random() * (range.length - 1));
	return range[index];
}
