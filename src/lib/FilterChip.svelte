<script lang="ts">
	import { nanoid } from 'nanoid';
	export let label: string;
	export let group: any[];
	export let colour: 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' = 'blue';
	export let value: any = label;
	export let selected: boolean = group.includes(value);

	const id = nanoid();

	const updateGroup = (selected: boolean) => {
		const index = group.indexOf(value);
		if (selected === true) {
			if (index < 0) group = [...group, value];
		} else {
			if (index >= 0) group = [...group.slice(0, index), ...group.slice(index + 1)];
		}
	};

	const updateCheckbox = (group: any[]) => (selected = group.indexOf(value) >= 0);

	$: updateGroup(selected);
	$: updateCheckbox(group);

	$: currentColour = selected ? colour : 'gray';
</script>

<label
	for={id}
	class={`text-sm rounded-xl px-2 inline-block text-${currentColour}-800 bg-${currentColour}-100 font-bold m-1`}
	style="cursor:default"
>
	{label}
</label>

<input {id} style="display: none;" type="checkbox" bind:checked={selected} {value} />
