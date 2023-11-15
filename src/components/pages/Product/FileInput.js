import React, { useRef } from 'react';
import './style.css'
const FileInput = ({ onImageSelected }) => {

    const inputRef = useRef();

    const handleOnChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function (e) {
                onImageSelected(reader.result);
            };
        }
    };

    const onChooseImg = () => {
        inputRef.current.click();
    };


    return (
        <div className='input_image'>
            {/* ==================== */}

                        <div class="formbold-mb-5 formbold-file-input">
                            <input
                                type="file"
                                accept="image/*"
                                ref={inputRef}
                                onChange={handleOnChange}
                                style={{ display: "none" }}
                                id='file'
                            />
                            <button className="input_btn" onClick={onChooseImg}>
                                Choose Image
                            </button>
                            <label for="file">
                                <div>
                                    <span class="formbold-drop-file"> Drop Photos here </span>
                                    <span class="formbold-or"> Or </span>
                                    <span class="formbold-browse"> Browse </span>
                                </div>
                            </label>
                        </div>

            {/* ==================== */}
            {/* <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleOnChange}
                style={{ display: "none" }}
            />

            <button className="input_btn" onClick={onChooseImg}>
                Choose Image
            </button> */}
        </div>
    );
};

export default FileInput;