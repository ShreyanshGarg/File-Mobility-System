function show() {
    const key = document.getElementById('inp').value;
    if(key === 'golu'){
        console.log('Success');
        const items = document.querySelectorAll('.switch');
        const newItems = document.querySelectorAll('.switch2');
        items.forEach(item => {
            item.style.display = 'none';
        })
        newItems.forEach(item => {
            item.style.display = 'block';
        })
    } else {
        document.querySelector('.switch').innerHTML = 'Invalid passcode please try again...';
        document.getElementById('inp').value = '';
    }
}