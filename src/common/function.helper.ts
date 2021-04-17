export function  EnumToArray(enumme) {  // Turn enum into array
    return Object.keys(enumme)
        .map(key => enumme[key]);
}
export function isNullOrUndefined(value) {
    return (value === null || value === undefined);
}

export function isNullOrEmpty(value : string) {
    return (value === null || value === undefined || value.trim() == "");
}

export function replaceAll(value: string, oldC: string, newC: string) {
	return value.split(oldC).join(newC);
}

/// ColumnNumericTransformer
export class ColumnNumericTransformer {
	to(data?: number | null): number | null {
		if (!isNullOrUndefined(data)) {
			return data
		}
		return null
	}

	from(data?: string | null): number | null {
		if (!isNullOrUndefined(data)) {
			const res = parseFloat(data)
			if (isNaN(res)) {
				return null
			} else {
				return res
			}
		}
		return null
	}
}