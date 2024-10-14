import React, { useState } from 'react';

function IdCheckPage(){

    const [form, setForm] = useState({
        userId: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
     };

    return (
        <form className= "IdCheckPage">
            <div className="form-container">
                <div className="form-group">
                <label>아이디</label>
                <input
                    type="text"
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    placeholder="6-20자 영문, 숫자"
                    required
                />
                <button type="button" >확인</button>
                </div>
            </div>
        </form>
    );
}

export default IdCheckPage;