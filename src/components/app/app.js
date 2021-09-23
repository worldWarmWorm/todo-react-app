import React, { Component } from "react";
import AppHeader from "../app-header";
import SearchPannel from "../search-pannel";
import PostStatusFilter from "../post-status-filter";
import PostList from "../post-list";
import PostAddForm from "../post-add-form";
import './app.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            term: '',
            filter: 'all'
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onToggleImportant = this.onToggleImportant.bind(this);
        this.onToggleLike = this.onToggleLike.bind(this);
        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this)
        this.maxId = 4;
    }

    deleteItem(id) {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id);
            const before = data.slice(0, index);
            const after = data.slice(index + 1);
            const newArr = [...before, ...after];
            return { data: newArr }
        })
    }

    addItem(body) {
        const newItem = {
            label: body,
            important: false,
            id: this.maxId++
        }

        this.setState(({data}) => {
            const newArr = [...data, newItem];
            return { data: newArr };
        })
    }

    onToggleImportant(id) {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id),
                old = data[index],
                newItem = {...old, important: !old.important},
                newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
            return { data: newArr }
        });
    }

    onToggleLike(id) {
        this.setState(({data}) => {
            const index = data.findIndex(elem => elem.id === id),
                old = data[index],
                newItem = {...old, like: !old.like},
                newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];
            return { data: newArr }
        });
    }

    searchPost(items, term) {
        if (!term) {
            return items;
        }

        return items.filter((item) => {
            return item.label.indexOf(term) > -1;
        })
    }

    filterPost(items, filter) {
        return filter === 'like' ? items.filter(item => item.like) : items;
    }

    onUpdateSearch(term) {
        this.setState({term});
    }

    onFilterSelect(filter) {
        this.setState({filter})
    }

    render() {
        const {data, term, filter} = this.state,
            liked = data.filter(item => item.like).length,
            allPosts = data.length,
            visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <div className="app">
                <AppHeader
                    liked={liked}
                    allPosts={allPosts}
                />
                <div className="search-panel d-flex">
                    <SearchPannel
                        onUpdateSearch={this.onUpdateSearch}/>
                    <PostStatusFilter
                        filter={filter}
                        onFilterSelect={this.onFilterSelect}/>
                </div>
                <PostList
                    posts={visiblePosts}
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLike={this.onToggleLike}
                />
                <PostAddForm onAdd={this.addItem}/>
            </div>
        );
    }
}