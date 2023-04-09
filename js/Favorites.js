
import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

        console.log(this.entries)
        
        
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            
            const userExists = this.entries.find(entry => entry.login === username)
            
            console.log(userExists)

            if (userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            console.log(user)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]

            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
            
        }

    }

    delete(user) {
        const filteredEntries = this.entries.filter(
            (entry) => entry.login !== user.login)
         
        this.entries = filteredEntries

        this.update()
        this.save()

    }
}


// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update() 
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }
    update() {
        this.removeAllTr()
        console.log(this.entries.length);
        if (this.entries.length > 0) {
            this.entries.forEach(user => {
                const row = this.createRow()

                row.querySelector('.user img').src = `https://github.com/${user.login}.png`
                row.querySelector('.user img').alt = `Imagem de ${user.name} `
                row.querySelector('.user a').href = `https://github.com/${user.login}`
                row.querySelector('.user p').textContent = user.name
                row.querySelector('.user span').textContent = user.login
                row.querySelector('.repositories').textContent = user.public_repos
                row.querySelector('.followers').textContent = user.followers

                row.querySelector('.remove').onclick = () => {
                    const isOk = confirm('Tem certeza que deseja deletar essa linha?')

                    if (isOk) {
                        this.delete(user)

                    }

                }

                this.tbody.append(row)

            })
         } else {
            const row = this.showMessageEmpty()
            this.tbody.append(row)

         }




    }
    removeAllTr() {

        this.tbody.querySelectorAll('tr').forEach((tr) => {
           tr.remove()
            
        });



    }


    createRow() {
        const tr = document.createElement('tr')
        const content = `
        <tr>
            <td class="user">
                <img src="https://github.com/raoliveira.png" alt="" srcset="">
                <a href="http://github.com/raoliveira" target="_blank" rel="noopener noreferrer">
                    <p>Ricardo</p>
                    <span>raoliveira</span>
                </a>
            </td>
            <td class="repositories">123</td>
            <td class="followers">321</td>
            <td class="remove"><a href="">Remover</a></td>
        </tr>
        `

        tr.innerHTML = content
         
        return tr
    }

    showMessageEmpty() {
        const tr = document.createElement('tr')
        tr.classList.add('notfound');

        const content = `
        <tr>
            <td colspan="4" >
                <div>
                    <img src="assets/Estrela.svg" alt="" srcset="">
                    <span>Nenhum favorito ainda</span>
                </div>
            </td>
        </tr>
        `

        tr.innerHTML = content
         
        return tr
    }
}