const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isManager, isCashier, hasRole } = require('../middleware/authMiddleware');
const Bill = require('../models/Bill');

// Tüm faturaları getir (sadece admin ve manager)
router.get('/', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Faturalar getirilirken bir hata oluştu', error: error.message });
    }
});

// Kullanıcının kendi faturalarını getir
router.get('/my-bills', verifyToken, async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Faturalar getirilirken bir hata oluştu', error: error.message });
    }
});

// Tek bir fatura getir
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate('user', 'firstName lastName email');
            
        if (!bill) {
            return res.status(404).json({ message: 'Fatura bulunamadı' });
        }

        // Sadece fatura sahibi veya admin/manager görebilir
        if (bill.user._id.toString() !== req.user.id && 
            !['admin', 'manager'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Bu faturayı görüntüleme yetkiniz yok' });
        }

        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Fatura getirilirken bir hata oluştu', error: error.message });
    }
});

// Yeni fatura oluştur (sadece admin, manager ve cashier)
router.post('/', verifyToken, hasRole(['admin', 'manager', 'cashier']), async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
        
        const bill = new Bill({
            user: req.user.id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress,
            status: 'pending'
        });

        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(400).json({ message: 'Fatura oluşturulurken bir hata oluştu', error: error.message });
    }
});

// Fatura durumunu güncelle (sadece admin ve manager)
router.patch('/:id/status', verifyToken, hasRole(['admin', 'manager']), async (req, res) => {
    try {
        const { status } = req.body;
        const bill = await Bill.findById(req.params.id);
        
        if (!bill) {
            return res.status(404).json({ message: 'Fatura bulunamadı' });
        }

        bill.status = status;
        await bill.save();
        
        res.json({ 
            message: 'Fatura durumu başarıyla güncellendi',
            bill: {
                id: bill._id,
                status: bill.status
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Fatura durumu güncellenirken bir hata oluştu', error: error.message });
    }
});

// Fatura güncelle
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Fatura bulunamadı'
            });
        }

        // Kullanıcı sadece kendi faturalarını güncelleyebilir (admin hariç)
        if (req.user.role !== 'admin' && bill.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu faturayı güncelleme yetkiniz yok'
            });
        }

        // Ödenmiş faturalar güncellenemez
        if (bill.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Ödenmiş faturalar güncellenemez'
            });
        }

        const updateFields = [
            'items', 'totalAmount', 'paymentMethod', 'shippingAddress', 'status'
        ];

        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                bill[field] = req.body[field];
            }
        });

        await bill.save();

        res.json({
            success: true,
            message: 'Fatura başarıyla güncellendi',
            data: bill
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Fatura güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

// Fatura sil
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Fatura bulunamadı'
            });
        }

        // Kullanıcı sadece kendi faturalarını silebilir (admin hariç)
        if (req.user.role !== 'admin' && bill.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bu faturayı silme yetkiniz yok'
            });
        }

        // Ödenmiş faturalar silinemez
        if (bill.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Ödenmiş faturalar silinemez'
            });
        }

        await bill.deleteOne();

        res.json({
            success: true,
            message: 'Fatura başarıyla silindi'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Fatura silinirken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router; 