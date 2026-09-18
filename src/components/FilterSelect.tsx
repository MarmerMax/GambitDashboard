import type { ChangeEvent } from 'react'
import { useCallback } from 'react'
import type { FilterValue } from '../types'

interface FilterSelectProps<Option extends string> {
    id: string
    label: string
    allLabel: string
    value: FilterValue<Option>
    options: readonly Option[]
    onChange: (value: FilterValue<Option>) => void
}

export const FilterSelect = <Option extends string>({
    id,
    label,
    allLabel,
    value,
    options,
    onChange,
}: FilterSelectProps<Option>) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value as FilterValue<Option>),
        [onChange],
    )

    return (
        <div className="field">
            <label className="field__label" htmlFor={id}>
                {label}
            </label>
            <select className="field__control" id={id} value={value} onChange={handleChange}>
                <option value="all">{allLabel}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
