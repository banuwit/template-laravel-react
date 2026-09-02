export type ExampleRecord = {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    join_date: string;
    gender: 'male' | 'female' | 'other';
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

export type ExampleRecordFormValues = {
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    join_date: string;
    gender: ExampleRecord['gender'];
    status: ExampleRecord['status'];
};

export type ExampleSortColumn =
    | 'name'
    | 'email'
    | 'department'
    | 'position'
    | 'join_date'
    | 'status'
    | 'created_at';

export type ExampleFilters = {
    search: string;
    sort: ExampleSortColumn;
    direction: 'asc' | 'desc';
};

export const GENDER_OPTIONS: {
    value: ExampleRecord['gender'];
    label: string;
}[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export const STATUS_OPTIONS: {
    value: ExampleRecord['status'];
    label: string;
}[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export function genderLabel(gender: ExampleRecord['gender']): string {
    return (
        GENDER_OPTIONS.find((option) => option.value === gender)?.label ??
        gender
    );
}

export function statusLabel(status: ExampleRecord['status']): string {
    return (
        STATUS_OPTIONS.find((option) => option.value === status)?.label ??
        status
    );
}
