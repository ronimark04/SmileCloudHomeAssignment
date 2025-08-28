function readNumber(id) {
    const raw = document.getElementById(id).value.trim();
    if (raw === '') return NaN;
    const v = Number(raw);
    return Number.isFinite(v) ? v : NaN;
}

function submit() {
    const A = { x: readNumber('A_x'), y: readNumber('A_y') };
    const B = { x: readNumber('B_x'), y: readNumber('B_y') };
    const C = { x: readNumber('C_x'), y: readNumber('C_y') };
    const invalid = [A.x, A.y, B.x, B.y, C.x, C.y].some(n => !Number.isFinite(n));
    const note = document.getElementById('note');
    if (invalid) {
        note.classList.remove('hidden');
        return;
    }
    note.classList.add('hidden');
    const params = new URLSearchParams({ ax: A.x, ay: A.y, bx: B.x, by: B.y, cx: C.x, cy: C.y }).toString();
    location.href = `result.html?${params}`;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go').addEventListener('click', submit);
    Array.from(document.querySelectorAll('input.xy')).forEach(input => {
        input.addEventListener('input', () => document.getElementById('note').classList.add('hidden'));
        input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    });
}); 