
var AuthJs = {
    /**
     * @param {Element} emailInput 
     * @param {Element} passwordInput 
     * @param {Node} errorDisp 
     */
    login: function (emailInput, passwordInput, errorDisp) {

        /**
         * @type {String}
         */
        let email = emailInput.value.trim();
        /**
         * @type {String}
         */
        let password = passwordInput.value.trim();

        function dispState(message, isGood) {
            errorDisp.innerText = message;
            errorDisp.style.display = 'flex';
            errorDisp.style.backgroundColor = '#eb8d8d';

            if (isGood == true) {
                errorDisp.style.backgroundColor = '#79aa44';
            }
        }

        function dispFieldErr(fieldNo, message) {

            let emailErrField = emailInput.parentElement.querySelector("span.disp");
            let passwordErrField = passwordInput.parentElement.querySelector("span.disp");

            if (message) {

                if (fieldNo == 1) {
                    emailErrField.style.display = 'unset';
                    emailErrField.innerText = message;
                } else if (fieldNo == 2) {
                    passwordErrField.style.display = 'unset';
                    passwordErrField.innerText = message;
                };

            } else {

                if (fieldNo == 1) {
                    emailErrField.style.display = 'none';
                } else if (fieldNo == 2) {
                    passwordErrField.style.display = 'none';
                };

            }

        };

        let bothGood = true;

        if (password.length > 5) {

            // good
            dispFieldErr(2);

        } else {
            dispFieldErr(2, "Enter a valid password");
            bothGood = false;
        }

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

            // good
            dispFieldErr(1);

        } else {

            dispFieldErr(1, "Enter a valid email");
            bothGood = false;

        }

        if (bothGood == true) {

            dispState('Loading...', true);

            fetch('/auth/login', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer abcdxyz',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }).then(res => res.json())
                .then((res) => {

                    if (res.status == 'error') {

                        dispState(res.message);

                    } else {
                        dispState(res.message, true);
                        window.location.href = res.action;
                    }

                })
                .catch(err => {
                    dispState("Error login");
                    console.error(err);
                });

        }

    },
    /**
     * @param {Element} email 
     * @param {Element} password 
     * @param {Element} conform 
     * @param {Element} errorDisp 
     */
    signup: function (nameInput, emailInput, passwordInput, conformInput, errorDisp) {
        /**
         * @type {String}
         */
        let email = emailInput.value.trim();
        /**
         * @type {String}
         */
        let password = passwordInput.value.trim();
        /**
         * @type {String}
         */
        let conform = conformInput.value.trim();       
        /**
        * @type {String}
        */
       let name = nameInput.value.trim();

        function dispState(message, isGood) {
            errorDisp.innerText = message;
            errorDisp.style.display = 'flex';
            errorDisp.style.backgroundColor = '#eb8d8d';

            if (isGood == true) {
                errorDisp.style.backgroundColor = '#79aa44';
            }
        };

        function dispFieldErr(fieldNo, message) {
            
            let emailErrField = emailInput.parentElement.querySelector("span.disp");
            let passwordErrField = passwordInput.parentElement.querySelector("span.disp");
            let nameErrField = nameInput.parentElement.querySelector("span.disp");
            let conformErrField = conformInput.parentElement.querySelector("span.disp");

            if (message) {

                if (fieldNo == 1) {
                    nameErrField.style.display = 'unset';
                    nameErrField.innerText = message;
                } else if (fieldNo == 2) {
                    emailErrField.style.display = 'unset';
                    emailErrField.innerText = message;
                }else if (fieldNo == 3) {
                    passwordErrField.style.display = 'unset';
                    passwordErrField.innerText = message;
                }else if (fieldNo == 4) {
                    conformErrField.style.display = 'unset';
                    conformErrField.innerText = message;
                };

            } else {

                if (fieldNo == 1) {
                    nameErrField.style.display = 'none';
                } else if (fieldNo == 2) {
                    emailErrField.style.display = 'none';
                }else if (fieldNo == 3) {
                    passwordErrField.style.display = 'none';
                }else if (fieldNo == 4) {
                    conformErrField.style.display = 'none';
                };

            }

        };

        let bothGood = true;

        if(name.length<=2){
            dispFieldErr(1,'Enter a valid name');
            bothGood = false;
        } else{
            dispFieldErr(1);
        }

        if (password.length > 5) {

            dispFieldErr(3);

            if (conform == password) {

                // good
                dispFieldErr(4);

            } else {
                dispFieldErr(4,"Conform password dosn't match");
                bothGood = false;
            }


        } else {
            dispFieldErr(3,"Enter a valid password");
            bothGood = false;
        }

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

            // good
            dispFieldErr(2);

        } else {

            dispFieldErr(2,"Enter a valid email");
            bothGood = false;

        }

        if (bothGood == true) {

            dispState('Loading...', true);

            fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer abcdxyz',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name:name
                })
            }).then(res => res.json())
                .then((res) => {

                    if (res.status == 'error') {

                        dispState(res.message);

                    } else {
                        dispState(res.message, true);
                        window.location.href = res.action;
                    }

                })
                .catch(err => {
                    dispState("Error login");
                    console.error(err);
                });

        }
    },
    logout: async function () {

        try {

            var data = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    logout: true,
                    message: 'in'
                })
            });

            data = await data.json();

            window.location.reload()

        } catch (error) {
            console.log(error);
        }

    }
}