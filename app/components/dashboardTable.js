export default function DashboardTable() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard Table Component</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">#</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-4 border-b">1</td>
                        <td className="py-2 px-4 border-b">John Doe</td>
                        <td className="py-2 px-4 border-b">john@example.com</td>
                        <td className="py-2 px-4 border-b">Admin</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 border-b">2</td>
                        <td className="py-2 px-4 border-b">Jane Smith</td>
                        <td className="py-2 px-4 border-b">jane@example.com</td>
                        <td className="py-2 px-4 border-b">User</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}