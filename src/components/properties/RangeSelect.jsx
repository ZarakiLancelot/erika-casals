import { useState } from 'react';
import { FilterSelect, PriceInput } from './styles';

const RangeSelect = ({ presets, value, onChange, placeholder, formatLabel }) => {
	const numValue = value === '' ? '' : Number(value);
	const isPreset = value === '' || presets.includes(numValue);
	const [customMode, setCustomMode] = useState(!isPreset);

	const showInput = customMode || !isPreset;
	const selectValue = showInput ? '__custom__' : value;

	const handleSelectChange = e => {
		if (e.target.value === '__custom__') {
			setCustomMode(true);
			onChange('');
		} else {
			setCustomMode(false);
			onChange(e.target.value);
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
			<FilterSelect value={selectValue} onChange={handleSelectChange}>
				<option value=''>{placeholder}</option>
				{presets.map(p => (
					<option key={p} value={p}>
						{formatLabel ? formatLabel(p) : p}
					</option>
				))}
				<option value='__custom__'>Personalizado...</option>
			</FilterSelect>
			{showInput && (
				<PriceInput
					type='number'
					placeholder={placeholder}
					value={value}
					onChange={e => onChange(e.target.value)}
				/>
			)}
		</div>
	);
};

export default RangeSelect;
