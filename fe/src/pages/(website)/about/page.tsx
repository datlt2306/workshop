type LayoutProps = {
    leftBar: React.ReactNode;
    rightBar: React.ReactNode;
};

function LayoutDemo(props: LayoutProps) {
    return (
        <div>
            <aside>{props.leftBar}</aside>
            <header>{props.rightBar}</header>
            <main>
                <h1>Hello World</h1>
            </main>
        </div>
    );
}

function App() {
    return (
        <div>
            <LayoutDemo leftBar={<div>Left Bar</div>} rightBar={<div>Right Bar</div>} />
        </div>
    );
}
export default App;
