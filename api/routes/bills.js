const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { auth, isAdmin } = require('../middleware/auth');

// Tüm faturaları getir (admin için)
router.get('/', isAdmin, async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Kullanıcının kendi faturalarını getir
router.get('/my-bills', auth, async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tek bir faturayı getir
router.get('/:id', auth, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate('user', 'firstName lastName email');
        
        if (!bill) {
            return res.status(404).json({ message: 'Fatura bulunamadı' });
        }

        // Kullanıcı admin değilse ve fatura kendisine ait değilse erişimi engelle
        if (req.user.role !== 'admin' && bill.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bu faturaya erişim izniniz yok' });
        }

        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Yeni fatura oluştur
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

        const bill = new Bill({
            user: req.user.id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress
        });

        const savedBill = await bill.save();
        res.status(201).json(savedBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Fatura durumunu güncelle (sadece admin)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ message: 'Fatura bulunamadı' });
        }

        bill.status = status;
        const updatedBill = await bill.save();
        res.json(updatedBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Fatura güncelle
router.patch('/:id', auth, async (req, res) => {
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
router.delete('/:id', auth, async (req, res) => {
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