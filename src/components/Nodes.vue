<template>
  <div class="hello">

       <sui-container >


       <sui-menu attached="top">
     <div class="header item">Arweave Node Monitor</div>

      <sui-menu-menu position="right">
        <sui-menu-item right>

             <sui-button  basic icon="sync alternate" size="medium" @click="refresh()" />

            <!-- <div class="ui action left icon input" placeholder="Lookup Node">
                <input type="text" placeholder="Lookup Node (IP:Port)">
                <i class="connectdevelop icon"></i>
                <button role="button" class="ui button">Save</button>
            </div> -->
          <!-- <sui-input transparent icon="search" placeholder="Search..." /> -->
        </sui-menu-item>
      </sui-menu-menu>
    </sui-menu>

           </sui-container >


      <!-- <h1>Nodes</h1> -->
      <br/><br/>

       <sui-container >
        <!-- <button class="ui right floated primary button"> Add a  Node</button> -->

         <sui-popup flowing hoverable >

            <sui-grid centered divided :columns="1">
            <sui-grid-column text-align="center">
                <form @submit.prevent="onNodeSubmit">

                <h4 is="sui-header">Add a New Node</h4>
                <p>
                    <sui-input v-model="form.ip" placeholder="IP: 188.166.200.45" focus required/> &nbsp;
                    <sui-input v-model="form.port" placeholder="Port( default: 1984)" focus />&nbsp;
                    <sui-input v-model="form.name" placeholder="Give a name" focus />
                </p>
                <sui-button>Submit</sui-button>
                </form>
            </sui-grid-column>
            </sui-grid>
            <!-- <sui-button  slot="trigger" >Add your Node</sui-button> -->

                    <!-- <button slot="trigger" class="ui right floated  button" style="margin-botton:10px"> Add a Node</button> -->

                    <button slot="trigger" class="ui labeled icon right floated button" style="margin-botton:10px">
                    <i class="plus icon"></i>
                    Add
                    </button>



        </sui-popup>
        
       </sui-container>


    
    <sui-container >
          
        
        <br/>

       <sui-table fixed single-line style="margin-top:25px" >
            <sui-table-header>
            <sui-table-row>
                <sui-table-header-cell>Ip</sui-table-header-cell>
                <sui-table-header-cell>Port</sui-table-header-cell>
                <sui-table-header-cell>Name</sui-table-header-cell>
                <sui-table-header-cell>Release</sui-table-header-cell>
                <sui-table-header-cell>Height</sui-table-header-cell>
                <sui-table-header-cell>Total Blocks</sui-table-header-cell>
                <sui-table-header-cell>Peers</sui-table-header-cell>
                <sui-table-header-cell>Latency</sui-table-header-cell>
                <sui-table-header-cell>Status</sui-table-header-cell>
                <sui-table-header-cell>
                    <!-- <sui-button primary basic icon="sync alternate" size="small" @click="refresh()" /> -->
                </sui-table-header-cell>
            </sui-table-row>
            </sui-table-header>
            <sui-table-body v-if="nodes">
                <sui-table-row v-for="node in nodes" :key="node.id" :positive="node.status == 'active'" :negative="node.status == 'unreachable'">
                    <sui-table-cell>{{node.ip}}</sui-table-cell>
                    <sui-table-cell>{{node.port}}</sui-table-cell>
                    <sui-table-cell>{{node.name}}</sui-table-cell>
                    <sui-table-cell>{{node.data?node.data.release:''}}</sui-table-cell>
                    <sui-table-cell>{{node.data?node.data.height:''}}</sui-table-cell>
                    <sui-table-cell>{{node.data?node.data.blocks:''}}</sui-table-cell>
                    <sui-table-cell>{{node.data?node.data.peers:''}}</sui-table-cell>
                    <sui-table-cell>{{node.data?node.data.node_state_latency:''}}</sui-table-cell>
                    <sui-table-cell>{{node.status == 'active'?'Active':'Unreachable'}}</sui-table-cell>
                    <sui-table-cell>
                          <sui-button circular icon="close" size="mini" @click="removeNode(node.id)"/>
                          &nbsp; <sui-loader :active="node.loading" inline />
                    </sui-table-cell>
                </sui-table-row>
            </sui-table-body>
         
       </sui-table>

       <sui-segment aligned="center">
      <p>Use the "Add" button to create your node list.  For getting latest status use the refresh button.</p>
      <p> Nodes are stored in your browser's localstorage.</p>
    </sui-segment>
    </sui-container>


 
  </div>
</template>

<script>
export default {
    name: 'Nodes',
    props: {
        msg: String
    },
    data () {
        return {
            nodes: {},
            form: {
                ip: '',
                port: '',
                name: ''

            }            

        }

    },
    created : function() {
        this.getNodes()
        this.updateNodes()

    },
    methods:  {

        refresh() {
            this.updateNodes()
        },

        onNodeSubmit() { 

            if(this.form.port == '') {
                this.form.port = '1984'
            }    

            let nodeKey = this.form.ip.trim()+':'+ this.form.port.trim()

            let node = { 
                'id': this.form.ip.trim() +':' + this.form.port.trim(),
                'name': this.form.name.trim(),
                'ip' : this.form.ip.trim(),
                'port': this.form.port.trim(),
                'status': '',
                'loading': true
            };

            this.$set(this.nodes, nodeKey, node)

            this.form.name = ''
            this.form.ip = ''
            this.form.port = ''

            this.syncNode(node)

        },

        getNodes() {
             this.nodes = JSON.parse(localStorage.getItem('nodes'))
        },

        saveNodes() {
            localStorage.setItem('nodes', JSON.stringify(this.nodes))
        },

        updateNodes() {

            let nodes = this.nodes

            let $this = this

            console.log('updating...')

            Object.keys(this.nodes).forEach(function (nodekey) {
                let node = $this.nodes[nodekey]
                $this.syncNode(node)
            });

        },

        syncNode(node) { 

        let url = 'http://' + node.ip + ':' + node.port + '/info'

        console.log('URl: '+ url)
        this.$set(node, 'loading', true)


        this.$axios.get(url, {
        timeout: 4000
        })
        .then(res => { 
            console.log(res.data)

            this.$set(node, 'loading', false)
            this.$set(node, 'status', 'active')
            this.$set(node, 'data', res.data)
            this.saveNodes()

            console.log('blocks',res.data.blocks)

                
        }).catch(err => { 
            this.$set(node, 'loading', false)
            this.$set(node, 'status', 'unreachable')
            console.log(err)
        })

        },
        removeNode(id) { 
            this.$delete(this.nodes, id)
            this.saveNodes()
        }

        

    },
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
